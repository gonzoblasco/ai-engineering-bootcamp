# Database schema design (Prisma)

## Cuándo usarlo
Cuando necesitas diseñar o modificar un schema de base de datos con Prisma. Cubre modelos, relaciones, índices y migraciones.

## Prompt
```
Diseña el schema de Prisma para el modelo {{MODEL_NAME}}.

Requisitos:
- Campos: {{FIELDS_DESCRIPTION}}
- Relaciones: {{RELATIONS_DESCRIPTION}}
- Índices en: {{INDEX_FIELDS}}
- Usa el provider {{DB_PROVIDER}} (postgresql/mysql/sqlite)
- Sigue las convenciones de naming: modelos en PascalCase, campos en camelCase, tablas en snake_case com @@map

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{MODEL_NAME}}` = Order
- `{{FIELDS_DESCRIPTION}}` = id (uuid, default), userId (FK a User), status (enum: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED), total (Decimal), items (JSON), createdAt, updatedAt
- `{{RELATIONS_DESCRIPTION}}` = belongsTo User (userId), hasMany OrderItem (cascade delete)
- `{{INDEX_FIELDS}}` = userId, status, createdAt
- `{{DB_PROVIDER}}` = postgresql
- `{{PROJECT_CONTEXT}}` = E-commerce API con Prisma + PostgreSQL, ya existe modelo User

**Output esperado:**
```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
  id        String      @id @default(uuid()) @db.Uuid
  userId    String      @db.Uuid
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  items     Json
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  user  User       @relation(fields: [userId], references: [id])
  items OrderItem[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}
```

## Notas
- Si el modelo ya existe, pide que genere la migración con `prisma migrate dev`
- Para relaciones many-to-many, Prisma usa modelos intermedios implícitos o explícitos
- Los enums de Prisma mapean a enums nativos en PostgreSQL, CHECK constraints en MySQL
