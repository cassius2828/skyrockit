# Embedding Data

## User Model
### Fields
- **_id**
  - Type: `ObjectId`
  - Options: None
- **username**
  - Type: `String`
  - Options: `{ required: true }`
- **password**
  - Type: `String`
  - Options: `{ required: true }`
- **applications**
  - Type: `[applicationSchema]`
  - Options: None

## Embedded Schema: applicationSchema
### Fields
- **_id**
  - Type: `ObjectId`
  - Options: None
- **company**
  - Type: `String`
  - Options: `{ required: true }`
- **title**
  - Type: `String`
  - Options: `{ required: true }`
- **notes**
  - Type: `String`
  - Options: None
- **postingLink**
  - Type: `String`
  - Options: None
- **status**
  - Type: `String`
  - Options: `{ enum: [ 'interested', 'applied', 'interviewing', 'rejected', 'accepted' ], required: true }`

## Relationship
- **One-to-many** relationship between User and applicationSchema

### Legend
- **Red**: User Model
- **Green**: Embedded Schema
- **Arrow**: One-to-many