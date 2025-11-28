# 📊 Data Dictionary - E-commerce System [🔙](../../README.md)

## 🚀 Introduction

This document presents the comprehensive data dictionary for the e-commerce system, detailing the database structure, validations, and constraints. The dictionary serves as a complete technical reference for developers, database administrators, and project stakeholders.

### 🎯 Document Objectives

- **Standardize** data structure across the entire application
- **Document** business rules implemented at database level
- **Facilitate** consistent frontend and backend development
- **Ensure** data integrity and quality
- **Serve** as reference for future system expansions

### 📋 Scope

The dictionary covers the six core system tables:

1. **👥 Persons** - User personal information
2. **🔐 Accounts** - Access credentials and roles
3. **📦 Products** - Available product catalog
4. **🏷️ Categories** - Product categorization
5. **🛒 Orders** - Customer order records
6. **📋 OrderDetails** - Specific items within each order

### 📝 Conventions & Notations

| Code  | Meaning        | SQL Equivalent | Description                                     |
| ----- | -------------- | -------------- | ----------------------------------------------- |
| 🟥 NN | Not Null       | NOT NULL       | The field is mandatory (cannot be empty)        |
| 🔑 UQ | Unique         | UNIQUE         | No duplicate values allowed in this column      |
| ➕ UN | Unsigned       | UNSIGNED       | Only positive values allowed (no negatives)     |
| 🔄 AI | Auto Increment | AUTO_INCREMENT | Value increases automatically (usually for IDs) |
| ⚪ O  | Optional       | (can be NULL)  | Field is optional and may be left empty         |

---

## 🗃️ System Tables

### 👥 Persons - Personal Information

| Key   | Attribute       | Conditions | Data Type      | Restrictions                               | Default Value | Comment                        |
| ----- | --------------- | ---------- | -------------- | ------------------------------------------ | ------------- | ------------------------------ |
| 🔑 PK | `person_id`     | `{NN, AI}` | `INT UNSIGNED` | -                                          | -             | Primary Key, auto-increment    |
|       | `first_name`    | `{NN}`     | `VARCHAR(50)`  | `^[A-Za-zÁÉÍÓÚáéíóúÑñ']{2,50}$`            | -             | First name (atomic, no spaces) |
|       | `last_name`     | `{NN}`     | `VARCHAR(50)`  | `^[A-Za-zÁÉÍÓÚáéíóúÑñ']{2,50}$`            | -             | Last name (atomic, no spaces)  |
|       | `dni`           | `{UQ, O}`  | `CHAR(8)`      | `^[0-9]{8}$`                               | `NULL`        | Optional; unique national ID   |
|       | `profile_photo` | `{O}`      | `VARCHAR(500)` | `^https:\/\/.*$`                           | `NULL`        | URL of user profile image      |
|       | `email`         | `{NN, UQ}` | `VARCHAR(150)` | `^[\\w\\.-]{1,64}@[\\w\\.-]+\\.\\w{2,63}$` | -             | Unique email; stored lowercase |
|       | `is_active`     | `{NN}`     | `BOOLEAN`      | `{true, false}`                            | `true`        | Account active status          |

### 🔐 Accounts - Access & Authentication

| Key   | Attribute    | Conditions | Data Type                 | Restrictions            | Default Value | Comment                                                       |
| ----- | ------------ | ---------- | ------------------------- | ----------------------- | ------------- | ------------------------------------------------------------- |
| 🔑 PK | `account_id` | `{NN, AI}` | `INT UNSIGNED`            | -                       | -             | Primary Key, auto-increment                                   |
|       | `user`       | `{NN, UQ}` | `VARCHAR(30)`             | `^[a-zA-Z0-9._]{2,30}$` | -             | Unique username. Stored in lowercase                          |
|       | `password`   | `{NN}`     | `VARCHAR(255)`            | -                       | -             | Store only PASSWORD HASH (bcrypt/argon2)                      |
|       | `role`       | `{NN}`     | `ENUM('client', 'admin')` | `{'client', 'admin'}`   | `'client'`    | User role within the system                                   |
|       | `is_active`  | `{NN}`     | `BOOLEAN`                 | `{true, false}`         | `true`        | Account active status                                         |
| 🔗 FK | `person_id`  | `{NN, UQ}` | `INT UNSIGNED`            | -                       | -             | Foreign Key (1:1 relationship). References Persons(person_id) |

### 🛒 Orders - Customer Orders

| Key   | Attribute      | Conditions | Data Type                                                      | Restrictions                                               | Default Value | Comment                                                         |
| ----- | -------------- | ---------- | -------------------------------------------------------------- | ---------------------------------------------------------- | ------------- | --------------------------------------------------------------- |
| 🔑 PK | `order_id`     | `{NN, AI}` | `INT UNSIGNED`                                                 | -                                                          | -             | Primary Key, auto-increment                                     |
|       | `order_number` | `{NN, UQ}` | `VARCHAR(20)`                                                  | `^[A-Z0-9-_]{4,20}$`                                       | -             | Unique order identifier. Uppercase, numbers, hyphen, underscore |
|       | `date`         | `{NN}`     | `DATE`                                                         | -                                                          | -             | Date when order was placed (ISO 8601)                           |
|       | `status`       | `{NN}`     | `ENUM('pending', 'paid', 'shipped', 'cancelled', 'delivered')` | `{'pending', 'paid', 'shipped', 'cancelled', 'delivered'}` | `'pending'`   | Current order state in fulfillment workflow                     |
| 🔗 FK | `person_id`    | `{NN}`     | `INT UNSIGNED`                                                 | -                                                          | -             | Foreign Key. References Persons(person_id)                      |

### 📋 OrderDetails - Order Line Items

| Key   | Attribute          | Conditions | Data Type       | Restrictions                   | Default Value | Comment                                      |
| ----- | ------------------ | ---------- | --------------- | ------------------------------ | ------------- | -------------------------------------------- |
| 🔑 PK | `order_detail_id`  | `{NN, AI}` | `INT UNSIGNED`  | -                              | -             | Primary Key, auto-increment                  |
|       | `quantity`         | `{NN}`     | `INT UNSIGNED`  | `CHECK (quantity >= 1)`        | `1`           | Product quantity in order (min 1)            |
|       | `historical_price` | `{NN}`     | `DECIMAL(10,2)` | `CHECK (historical_price > 0)` | -             | Historical unit price at order time          |
| 🔗 FK | `order_id`         | `{NN}`     | `INT UNSIGNED`  | -                              | -             | Foreign Key. References Orders(order_id)     |
| 🔗 FK | `product_id`       | `{NN}`     | `INT UNSIGNED`  | -                              | -             | Foreign Key. References Products(product_id) |

### 📦 Products - Product Catalog

| Key   | Attribute     | Conditions | Data Type       | Restrictions                             | Default Value | Comment                                                 |
| ----- | ------------- | ---------- | --------------- | ---------------------------------------- | ------------- | ------------------------------------------------------- |
| 🔑 PK | `product_id`  | `{NN, AI}` | `INT UNSIGNED`  | -                                        | -             | Primary Key, auto-increment                             |
|       | `sku`         | `{NN, UQ}` | `VARCHAR(20)`   | `^[A-Z0-9-]{3,20}$`                      | -             | Unique stock keeping unit. Internal product identifier  |
|       | `name`        | `{NN}`     | `VARCHAR(100)`  | `^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'\-]{2,100}$` | -             | Product name with letters, numbers, spaces, punctuation |
|       | `image`       | `{O}`      | `VARCHAR(500)`  | `^https:\/\/.*$`                         | `NULL`        | URL of product image                                    |
|       | `description` | `{O}`      | `TEXT`          | `LENGTH(description) BETWEEN 2 AND 2000` | `NULL`        | Product description (2-2000 chars if provided)          |
|       | `price`       | `{NN}`     | `DECIMAL(10,2)` | `CHECK (price > 0)`                      | -             | The product's current price                             |
|       | `stock`       | `{NN}`     | `INT UNSIGNED`  | `CHECK (stock >= 0)`                     | `0`           | Available quantity. 0 when out of stock                 |
|       | `is_active`   | `{NN}`     | `BOOLEAN`       | `{true, false}`                          | `true`        | Product active status                                   |
| 🔗 FK | `category_id` | `{NN}`     | `INT UNSIGNED`  | -                                        | -             | Foreign Key. References Categories(category_id)         |

### 🏷️ Categories - Product Categorization

| Key   | Attribute     | Conditions | Data Type      | Restrictions                             | Default Value | Comment                                                  |
| ----- | ------------- | ---------- | -------------- | ---------------------------------------- | ------------- | -------------------------------------------------------- |
| 🔑 PK | `category_id` | `{NN, AI}` | `INT UNSIGNED` | -                                        | -             | Primary Key, auto-increment                              |
|       | `name`        | `{NN, UQ}` | `VARCHAR(100)` | `^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'\-]{2,100}$` | -             | Category name with letters, numbers, spaces, punctuation |
|       | `image`       | `{O}`      | `VARCHAR(255)` | `^https:\/\/.*$`                         | `NULL`        | URL of category image                                    |
|       | `description` | `{O}`      | `TEXT`         | `LENGTH(description) BETWEEN 2 AND 2000` | `NULL`        | Category description (2-2000 chars if provided)          |
|       | `is_active`   | `{NN}`     | `BOOLEAN`      | `{true, false}`                          | `true`        | Category active status                                   |

---

## 🎯 Table-Level Constraints

### OrderDetails Unique Constraint

**🔒 UNIQUE KEY `(order_id, product_id)`** - Prevents the same product from being added twice to the same order

---

## 💡 Conclusion

This data dictionary provides a robust foundation for the e-commerce system implementation, ensuring data consistency, integrity, and scalability. The design follows database normalization principles while implementing essential business rules at the database level.

### ✅ Key Strengths

- **Data Integrity** - Comprehensive constraints and validations
- **Scalability** - Proper indexing and relationship design
- **Security** - Secure authentication and authorization structure
- **Maintainability** - Clear documentation for future development

### 🚀 Ready for Implementation

The database schema is now fully documented and ready for development phase implementation.

---

_✨ Building the future of e-commerce, one table at a time! ✨_

[🔙 Back](../../README.md)
