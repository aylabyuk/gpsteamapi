import { Site,
  Contact,
  Antenna,
  Receiver,
  Staff,
  Logsheet,
  Division,
  Position,
  Email,
  ContactNumber,
  FieldWork,
  FileUpload,
  User
} from '../sql/connector';

import { GraphQLScalarType } from 'graphql';
import GraphQLToolsTypes from 'graphql-tools-types';
import sequelize from 'sequelize'
import { PubSub } from 'graphql-subscriptions';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { requiresStaff, requiresAdmin, requiresAuth } from './permissions'
import { refreshTokens, tryLogin } from './auth';

import { getnewPath } from './fsmodule'

export const pubsub = new PubSub

const resolvers = {
  Mutation: {
    createContact(_, args) {
      return Contact.create(args)
        .then((newcontact) => {
          pubsub.publish('contactCreated', newcontact.dataValues);
          return newcontact;
        }).catch((err) => {
          console.error(err);
          return err;
        });
    },
    createLogsheet: requiresStaff.createResolver((_, args) => {
      console.log('args', args.input);

      return Logsheet.create(args.input)
        .then((newlogsheet) => {
          // query staffs and add it to logsheet as observers
          // NOTE: need to fix async
          Staff.findAll({
            where: { id: { $in: args.input.observers.map((a) => { return a.id; }) } },
          }).then((staffs) => {
            newlogsheet.setStaffs(staffs);
          });

          pubsub.publish('logsheetCreated', newlogsheet);
          return newlogsheet;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    }),
    updateLogsheet(_, args) {
      console.log('args update', args.input)

      return Logsheet.update(args.input, { where: { id: args.input.id} })
        .then((result) => {

          return Logsheet.findById(args.input.id)
            .then((updatedLogsheet) => {
              
              Staff.findAll({
                where: { id: { $in: args.input.observers.map((a) => { return a.id; }) } },
              }).then((staffs) => {
                updatedLogsheet.setStaffs(staffs);
              });

              return updatedLogsheet

            })

        })
        .catch((err) => {
          console.log(err);
          return err
        })
    },
    deleteContact(_, args) {
      return Contact.destroy({ where: args })
        .then((success) => {
          console.log('success', success);
          console.log('id', args);
          pubsub.publish('contactDeleted', args.id);
          return args.id;
        });
    },
    createStaff(_, args) {
      return Staff.create(args.input, {
        include: [Email, ContactNumber],
      })
        .then((newstaff) => {
          pubsub.publish('staffCreated', newstaff);
          return newstaff;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    },
    createSite(_, args) {
      return Site.create(args.input)
        .then((newsite) => {
          return newsite;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    },
    createReceiver(_, args) {
      return Receiver.create(args.input)
        .then((newReceiver) => {
          return newReceiver;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    },
    createAntenna(_, args) {
      return Antenna.create(args.input)
        .then((newAntenna) => {
          return newAntenna;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    },
    createFieldwork(_, args) {
      return FieldWork.create(args.input)
        .then((newFieldwork) => {
          Staff.findAll({
            where: { id: { $in: args.input.staffs.map((a) => { return a.id; }) } },
          }).then((staffs) => {
            newFieldwork.setStaffs(staffs);
          });

          return newFieldwork;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    },
    updateSiteTimeseriesPreview(_, args) {
      let newpath = getnewPath(args)

      return FileUpload.create({...args.timeseriesPreview, description: 'timeSeriesPreview', path: newpath})
        .then((newTimeSeriesPreview) => {

          Site.find({
            where: { name: args.siteName }
          }).then((site) => {
            site.addFile_uploads(newTimeSeriesPreview)  
          })

          return newTimeSeriesPreview;
        })
        .catch((err) => {
          console.error(error);
          return err;
        })
    },
    register: async (_, args) => {
      const user = args;
      user.password = await bcrypt.hash(user.password, 12);

      console.log('Register user: ', user)
      return User.create(user)
    },
    login: async (parent, { email, password }, { SECRET }) => tryLogin(email, password, SECRET),
    refreshTokens: (parent, { token, refreshToken }, { SECRET }) => refreshTokens(token, refreshToken, SECRET),
  },
  Subscription: {
    contactDeleted: {
      resolve: (payload) => { return payload},
      subscribe: () => pubsub.asyncIterator('contactDeleted')
    },
    contactCreated: {
      resolve: (payload) => { return payload},
      subscribe: () => pubsub.asyncIterator('contactCreated')
    },
    logsheetCreated: {
      resolve: (payload) => { return payload},
      subscribe: () => pubsub.asyncIterator('logsheetCreated') 
    },
    logsheetUpdated: {
      resolve: (payload) => { return payload},
      subscribe: () => pubsub.asyncIterator('logsheetUpdated')
    },
    staffCreated: {
      resolve: (payload) => { return payload},
      subscribe: () => pubsub.asyncIterator('staffCreated')
    },
  },
  Query: {
    allSite: requiresAuth.createResolver((_, args) => {
      return Site.findAll({ limit: args.limit,
        offset: args.offset,
        include: [{ all: true }] });
    }),
    checkDuplicateLogsheetEntry(_, args) {
      return Site.findAll({
        where: {
          name: args.name,
          '$logsheets.logsheet_date$': args.date,
        },
        include: [
          Logsheet,
        ],
      });
    },
    sitesWithLogsheet: requiresAuth.createResolver((_, args) => {
      if(args.name == undefined) {
        return Site.findAll({
            where: { '$logsheets.survey_type$': 'CAMPAIGN', },
            order: ['name'],
            include: [
              Logsheet,
            ],
          });
      } else {
        return Site.findAll({
          where: {
            name: {
              $in: args.name
            }
          },
          order: ['name'],
          include: [
            Logsheet,
          ],
        });
      }
    }),
    allContact: requiresAuth.createResolver((_, args) => {
      return Contact.findAll({ limit: args.limit, offset: args.offset, order: [args.order] });
    }),
    Antenna: requiresAuth.createResolver((_, args) => {
      return Antenna.find({ where: args });
    }),
    allAntenna: requiresAuth.createResolver(() => {
      return Antenna.findAll();
    }),
    Receiver: requiresAuth.createResolver((_, args) => {
      return Receiver.find({ where: args });
    }),
    allReceiver: requiresAuth.createResolver(() => {
      return Receiver.findAll();
    }),
    allStaff: requiresStaff.createResolver((_, args) => {
      return Staff.findAll({
        include: [{ all: true }],
        order: [args.order],
      });
    }),
    allLogsheet: requiresAuth.createResolver((_, args) => {
      return Logsheet.findAll({
        include: [{ all: true }],
        where: args,
      });
    }),
    singleLogsheet: requiresAuth.createResolver((_, args) => {
      return Logsheet.find({ include: [{ all: true }], where: args });
    }),
    allDivision() {
      return Division.findAll();
    },
    allPosition() {
      return Position.findAll();
    },
    allFieldWork() {
      return FieldWork.findAll({
        include: [{ all: true }],
      });
    },
    siteTimeseriesPreview(_, args) {
      return FileUpload.findOne({
        include: [{ all: true }],
        where: {
          '$site.name$': args.name,
          description: "timeSeriesPreview"
        }
      })
    },
    timeseriesJpgFiles: requiresAuth.createResolver(() => {
      const fs = require('fs');
      let files = []

      fs.readdirSync('./gpsUPLOADS/timeseries').forEach((f) => {
        console.log(f)
        files.push(f.toString())
      })

      return files

    }),
    me: (_, args, { user }) => {
      if(user) {
        return User.findOne({
          where: {
            id: user.id,
          }
        });
      }

      // not logged in
      return null     
    },
    // input more query at the top of this comment
  },
  Filename: {
    name(n) {
      let name = n.replace('.jpg', '')
      return name;
    }
  },
  Site: {
    logsheets(site) {
      return site.getLogsheets();
    }
  },
  FileUpload: {
    site(fileupload) {
      return fileupload.getSite();
    }
  },
  Logsheet: {
    antenna(logsheet) {
      return logsheet.getAntenna();
    },
    receiver(logsheet) {
      return logsheet.getReceiver();
    },
    observers(logsheet) {
      return logsheet.getStaffs();
    },
    site(logsheet) {
      return logsheet.getSite();
    },
    contact(logsheet) {
      return logsheet.getContact_person();
    },
  },
  Staff: {
    emails(staff) {
      return staff.getEmails();
    },
    contact_numbers(staff) {
      return staff.getContact_numbers();
    },
    division(staff) {
      return staff.getDivision();
    },
    position(staff) {
      return staff.getPosition();
    },
  },
  Date: GraphQLToolsTypes.Date({ name: 'Date' }),
};


export default resolvers;
