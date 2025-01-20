# Notes Keeper API

Notes Keeper API is a RESTful service designed for personal note management, providing developers with a robust and scalable backend for building various note-taking applications. Built with MongoDB for flexible document storage, our service combines simplicity with powerful features to help users organize and manage their thoughts effectively.

## Project Overview

### Vision Statement

We aim to create a universal and reliable note management platform that can serve as a foundation for various client applications - from simple note-taking tools to complex knowledge management systems. By leveraging MongoDB's document-oriented architecture, we provide flexible and efficient data storage that adapts to evolving user needs.

### Key Features

Our service offers a comprehensive set of capabilities for working with notes:

#### Note Management

- Create notes with rich text formatting
- Read and update existing notes
- Soft delete with recovery options
- Archive functionality
- Draft support
- Version history tracking

#### Organization and Categorization

- Flexible tagging system
- Hierarchical categories
- Note collections
- Smart filters and dynamic grouping
- Full-text search capabilities using MongoDB Atlas Search

#### Search and Filtering

- Content-based full-text search
- Advanced filtering options
- Tag and category-based queries
- Customizable sorting

### Technical Architecture

#### Data Models

##### Note Document

```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  status: String,
  tags: [{
    _id: ObjectId,
    name: String,
    color: String
  }],
  category: {
    _id: ObjectId,
    name: String
  },
  isPinned: Boolean,
  isPublic: Boolean,
  version: Number,
  metadata: {
    createdAt: ISODate,
    updatedAt: ISODate,
    deletedAt: ISODate
  }
}
```

#### System Architecture Diagrams

##### Component Architecture

Our system follows a layered architecture pattern that promotes separation of concerns and maintainability. Below is a detailed component diagram showing the relationships between different layers and modules:

```mermaid
graph TB
    subgraph External["External Layer"]
        Client["Client Applications"]
    end

    subgraph API["Notes Keeper API"]
        subgraph Presentation["Presentation Layer"]
            Router["Router (Express.js)"]
            Middleware["Middleware Layer"]
            subgraph Controllers["Controllers"]
                NoteController["Note Controller"]
                TagController["Tag Controller"]
                CategoryController["Category Controller"]
            end
        end

        subgraph Business["Business Layer"]
            subgraph Services["Service Layer"]
                NoteService["Note Service"]
                TagService["Tag Service"]
                CategoryService["Category Service"]
                SearchService["Search Service"]
            end
        end

        subgraph Data["Data Access Layer"]
            subgraph Repositories["Repository Layer"]
                NoteRepo["Note Repository"]
                TagRepo["Tag Repository"]
                CategoryRepo["Category Repository"]
            end
        end

        subgraph Infrastructure["Infrastructure Layer"]
            Logger["Logging Service"]
            Cache["Cache Service"]
            Validation["Validation Service"]
            ErrorHandler["Error Handler"]
        end
    end

    subgraph Storage["Storage Layer"]
        MongoDB[(MongoDB Database)]
    end

    %% Connections between layers
    Client --> Router
    Router --> Middleware
    Middleware --> Controllers

    NoteController --> NoteService
    TagController --> TagService
    CategoryController --> CategoryService

    NoteService --> NoteRepo
    TagService --> TagRepo
    CategoryService --> CategoryRepo
    NoteService --> SearchService

    NoteRepo --> MongoDB
    TagRepo --> MongoDB
    CategoryRepo --> MongoDB

    %% Infrastructure connections
    Controllers --> Logger
    Services --> Logger
    Controllers --> ErrorHandler
    Services --> Cache
    Controllers --> Validation

    %% Styling with black text
    classDef external fill:#e9e9e9,stroke:#333,stroke-width:2px,color:#000
    classDef presentation fill:#b7e3ff,stroke:#333,stroke-width:2px,color:#000
    classDef business fill:#c9e7c9,stroke:#333,stroke-width:2px,color:#000
    classDef data fill:#ffe0b7,stroke:#333,stroke-width:2px,color:#000
    classDef infrastructure fill:#f5b7eb,stroke:#333,stroke-width:2px,color:#000
    classDef storage fill:#d4d4d4,stroke:#333,stroke-width:2px,color:#000

    class Client,External external
    class Router,Middleware,NoteController,TagController,CategoryController presentation
    class NoteService,TagService,CategoryService,SearchService business
    class NoteRepo,TagRepo,CategoryRepo data
    class Logger,Cache,Validation,ErrorHandler infrastructure
    class MongoDB storage
```

The component diagram illustrates the following layers:

1. External Layer: Client applications that consume our API
2. Presentation Layer: Handles HTTP routing, middleware, and controller logic
3. Business Layer: Contains core business logic in service components
4. Data Access Layer: Manages data persistence through repositories
5. Infrastructure Layer: Provides cross-cutting concerns like logging and caching
6. Storage Layer: MongoDB database for persistent storage

##### Entity Relationship Diagram

The following diagram shows the complete data model with all entities and their relationships:

```mermaid
erDiagram
    User ||--o{ Note : creates
    User ||--o{ Tag : manages
    User ||--o{ Category : manages
    Note ||--o{ NoteVersion : has
    Note ||--o{ NoteTag : has
    Note ||--o| Category : belongs_to
    Tag ||--o{ NoteTag : associated_with
    Category ||--o| Category : has_parent
    Note ||--o{ SharedNote : shared_with
    User ||--o{ SharedNote : has_access_to

    User {
        ObjectId _id PK
        String email UK
        String username
        String passwordHash
        String role
        Date lastLoginAt
        Boolean isActive
        Date createdAt
        Date updatedAt
    }

    Note {
        ObjectId _id PK
        ObjectId userId FK
        String title
        String content
        String contentType "markdown/plain/html"
        String status "active/archived/deleted"
        Boolean isPinned
        Boolean isPublic
        Number version
        ObjectId categoryId FK
        Date createdAt
        Date updatedAt
        Date deletedAt
        String searchVector
    }

    NoteVersion {
        ObjectId _id PK
        ObjectId noteId FK
        String title
        String content
        Number versionNumber
        Date createdAt
        ObjectId createdBy FK
        String changeDescription
    }

    Tag {
        ObjectId _id PK
        ObjectId userId FK
        String name UK
        String color
        String description
        Date createdAt
        Date updatedAt
        Boolean isSystem
    }

    Category {
        ObjectId _id PK
        ObjectId userId FK
        String name
        ObjectId parentId FK
        String description
        String icon
        Number order
        Date createdAt
        Date updatedAt
    }

    NoteTag {
        ObjectId _id PK
        ObjectId noteId FK
        ObjectId tagId FK
        Date addedAt
        ObjectId addedBy FK
    }

    SharedNote {
        ObjectId _id PK
        ObjectId noteId FK
        ObjectId userId FK
        String permission "read/write"
        Date sharedAt
        ObjectId sharedBy FK
        Date expiresAt
    }
```

Key aspects of the data model:

1. User Management

   - Users can create and manage notes, tags, and categories
   - Support for role-based access control
   - Tracking of user activity and account status

2. Note Management

   - Rich content support with versioning
   - Flexible status management (active/archived/deleted)
   - Support for pinning and public sharing
   - Full audit trail of changes

3. Organization

   - Hierarchical categories with ordering
   - Flexible tagging system
   - Note sharing with permissions
   - Version control for note content

4. Search and Discovery
   - Full-text search capabilities
   - Tag and category-based filtering
   - Smart filters and dynamic grouping

##### Note Creation Sequence

The following sequence diagram illustrates the flow of creating a new note:

```mermaid
sequenceDiagram
    participant C as Client
    participant WL as Web Layer
    participant CO as Controller
    participant S as Service
    participant R as Repository
    participant DB as MongoDB
    participant CA as Cache

    C->>WL: POST /api/v1/notes
    WL->>CO: createNote(dto)
    CO->>S: validateAndCreate(note)
    S->>R: save(note)
    R->>DB: insert(document)
    DB-->>R: document
    R-->>S: note
    S->>CA: invalidateRelated()
    S-->>CO: created note
    CO-->>WL: response
    WL-->>C: 201 Created
```

This sequence shows:

1. Request handling through the web layer
2. Data validation and processing in controllers
3. Business logic execution in services
4. Data persistence through repositories
5. Cache invalidation for consistency
6. Response formatting and delivery

#### Technology Stack

##### Core Technologies

- Runtime: Node.js 20.x
- Framework: Express.js 4.x
- Database: MongoDB 7.x
- ODM: Mongoose 8.x
- Caching: MongoDB Cache (built-in)

##### Development Tools

- Version Control: Git
- Linter: ESLint with Airbnb style guide
- Formatting: Prettier
- Testing: Jest + Supertest
- API Documentation: OpenAPI 3.0

##### Monitoring and Logging

- Logging: Winston
- Monitoring: MongoDB Atlas monitoring
- Performance: MongoDB Compass
- Tracing: OpenTelemetry

### API Endpoints

#### Notes Management

```http
POST   /api/v1/notes              # Create a new note
GET    /api/v1/notes              # Retrieve notes list
GET    /api/v1/notes/:id          # Get specific note
PUT    /api/v1/notes/:id          # Update note
DELETE /api/v1/notes/:id          # Soft delete note
PATCH  /api/v1/notes/:id/archive  # Archive note
PATCH  /api/v1/notes/:id/restore  # Restore note
GET    /api/v1/notes/search       # Full-text search in notes
```

#### Tags Management

```http
GET    /api/v1/tags               # Get tags list
POST   /api/v1/tags               # Create new tag
PUT    /api/v1/tags/:id           # Update tag
DELETE /api/v1/tags/:id           # Delete tag
GET    /api/v1/tags/:id/notes     # Get notes by tag
```

#### Categories Management

```http
GET    /api/v1/categories         # Get categories list
POST   /api/v1/categories         # Create new category
PUT    /api/v1/categories/:id     # Update category
DELETE /api/v1/categories/:id     # Delete category
```

### Architectural Principles

Our project follows these key principles:

1. Clean Architecture

   - Separation of concerns with clear layers
   - Business logic independence
   - Framework agnostic core
   - Dependency injection

2. SOLID Principles

   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

3. MongoDB Best Practices

   - Proper indexing strategy
   - Efficient document schema design
   - Atomic operations usage
   - Aggregation pipeline optimization
   - Proper data modeling and embedding

4. Security
   - MongoDB authentication and authorization
   - Input sanitization
   - API rate limiting
   - Request validation
   - Secure connection strings

### Deployment

#### Environment Requirements

- Node.js 20.x or higher
- MongoDB 7.x or higher
- Docker and Docker Compose
