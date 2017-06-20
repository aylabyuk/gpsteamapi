const typeDefs = [`

scalar Date
scalar Float

type Subscription {
  contactCreated: Contact,
  contactDeleted: ID,
  logsheetCreated: Logsheet,
  staffCreated: Staff
}

type Mutation {
  createContact(
    first_name: String!,
    last_name: String!,
    position: String,
    contact_number: String!,
    organization: String,
    email_add: String,
    address_one: String,
    address_two: String,
    city: String,
    province: String,
  ) : Contact

  deleteContact(
    id: ID
  ) : ID

  createStaff(
    input: StaffInput
  ) : Staff

  createLogsheet(
    input: LogsheetInput
  ) : Logsheet

  createReceiver(
    input: ReceiverInput
  ) : Receiver

  createAntenna(
    input: AntennaInput
  ) : Antenna

  createSite(
    input: SiteInput
  ) : Site

  createFieldwork(
    input: FieldworkInput
  ) : Fieldwork

  updateSiteTimeseriesPreview(
    siteName: String!
    timeseriesPreview: File!
  ) : Site
}

type Query {

  allSite(limit: Int, offset: Int): [Site]

  sitesWithLogsheet: [Site]

  checkDuplicateLogsheetEntry(name: String, date: Date): [Site]

  allContact(limit: Int, offset: Int, order: String): [Contact]

  Antenna(id: ID, serial_number: String, type: String, part_number: String): Antenna
    allAntenna: [Antenna]
    
  Receiver(id: ID, serial_number: String, type: String, part_number: String): Receiver
    allReceiver: [Receiver]

  allStaff(order: String): [Staff]

  allLogsheet(logsheet_date: Date): [Logsheet]
    singleLogsheet(id: ID): Logsheet

  allDivision: [Division]

  allPosition: [Position]

  allFieldWork: [Fieldwork]

  siteTimeseriesPreview(name: String): FileUpload

}

type FileUpload {
  id: ID
  name: String
  type: String
  size: Int
  path: String
  site: Site
  description: String
}

type Contact {
  id: ID,
  first_name: String,
  last_name: String,
  position: String,
  contact_number: String,
  organization: String,
  email_add: String,
  address_one: String,
  address_two: String,
  city: String,
  province: String,
}

type Site {
  id: ID
  name: String
  aka: String
  marker: String
  constructed: Date
  survey_type: String
  long: String
  lat: String
  address: String
  description: String
  logsheets: [Logsheet]
}

input SiteInput {
  name: String
  aka: String
  marker: String
  constructed: Date
  survey_type: String
  long: String
  lat: String
}

type Antenna {
  id: ID
  serial_number: String
  type: String
  part_number: String
}

input AntennaInput {
  serial_number: String
  type: String
  part_number: String
}

type Receiver {
  id: ID
  serial_number: String
  type: String
  part_number: String
}

input ReceiverInput {
  serial_number: String
  type: String
  part_number: String
}

type Staff {
  id: ID
  first_name: String
  last_name: String
  nickname: String
  position: Position
  division: Division
  contact_numbers: [ContactNumber]
  emails: [Email]
  office_location: String
  birthday: Date
}

input StaffInput {
  first_name: String
  last_name: String
  nickname: String
  positionId: Int
  divisionId: Int
  contact_numbers: [ContactNumberInput]
  emails: [EmailInput]
  office_location: String
  birthday: Date
}

type Division {
  id: ID
  division_name: String
}

type Position {
  id: ID
  position_name: String
}

type Email {
  id: ID
  address: String
}

input EmailInput {
  address: String
}

type ContactNumber {
  id: ID
  number: String
}

input ContactNumberInput {
  number: String
}

enum SurveyType {
  CONTINUOUS
  CAMPAIGN
}

type Logsheet {
  id:  ID 
  survey_type:  SurveyType
  logsheet_date:  Date
  julian_day:  Int
  location: String
  marker:  String
  observers: [Staff]   
  site:  Site       
  north:  Float   
  east:  Float   
  south:  Float   
  west:  Float   
  time_start:  String   
  time_end:  String   
  azimuth:  Int
  failure_time:  String   
  receiver_status:  String   
  antenna_status:  String   
  rod_num:  Int   
  rod_correction:  Int   
  avg_slant_height:  Float   
  ip_add:  String   
  netmask:  String   
  gateway:  String   
  dns:  String   
  local_tcp_port:  String   
  latitude:  Float   
  longitude:  Float   
  observed_situation:  String   
  lodging_road_information:  String   
  others:  String  
  antenna:  Antenna  
  receiver:  Receiver  
  contact:  Contact 
  fieldworkId: Int
}

input StaffIdInput {
  id: Int
}

input LogsheetInput {
  survey_type:  String
  logsheet_date:  Date
  julian_day:  Int
  location: String
  marker:  String
  observers: [StaffIdInput]   
  siteId:  Int     
  north:  Float   
  east:  Float   
  south:  Float   
  west:  Float   
  time_start:  String   
  time_end:  String   
  azimuth:  Int
  failure_time:  String   
  receiver_status:  String   
  antenna_status:  String   
  rod_num:  Int   
  rod_correction:  Int   
  avg_slant_height:  Float   
  ip_add:  String   
  netmask:  String   
  gateway:  String   
  dns:  String   
  local_tcp_port:  String   
  latitude:  Float   
  longitude:  Float   
  observed_situation:  String   
  lodging_road_information:  String   
  others:  String  
  antennaId:  String  
  receiverId:  String  
  contactPersonId: Int
  fieldworkId: Int
}

input File {
  name: String!
  type: String!
  size: Int!
  path: String!
}

type Fieldwork {
  id: ID
  year: Int
  month: String
  description: String
  staffs: [Staff]
}

input FieldworkInput {
  year: Int
  month: String
  description: String
  staffs: [StaffIdInput]
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

`];

export default typeDefs;
