-------------------------------------------
-- CREAR BASE DE DATOS SI NO EXISTE
-------------------------------------------
IF NOT EXISTS(SELECT 1 FROM sys.databases WHERE name = 'UdlaDB')
BEGIN
    PRINT 'Database UdlaDB does not exist. Creating...';
    CREATE DATABASE UdlaDB;
END
ELSE
BEGIN
    PRINT 'Database UdlaDB already exists. Skipping creation.';
END;
GO

USE UdlaDB;
GO

---------------------------------------------------
-- PERSONS TABLE
---------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Persons')
BEGIN
    PRINT 'Creating Persons table...';

    CREATE TABLE Persons (
        PersonId INT IDENTITY(1,1) PRIMARY KEY,
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        CountryCode VARCHAR(5) NOT NULL,
        PhoneNumber VARCHAR(20) NOT NULL,
        Age INT NULL,
        Address NVARCHAR(250) NULL,
        PhotoUrl NVARCHAR(500) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
ELSE
BEGIN
    PRINT 'Persons table already exists.';
END
GO


---------------------------------------------------
-- ROLES TABLE
---------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Roles')
BEGIN
    PRINT 'Creating Roles table...';

    CREATE TABLE Roles (
        RoleId INT IDENTITY(1,1) PRIMARY KEY,
        RoleName NVARCHAR(100) NOT NULL,
        Description NVARCHAR(200) NULL
    );

    PRINT 'Inserting default roles...';

    INSERT INTO Roles (RoleName, Description)
    VALUES ('Admin', 'Administrador del sistema'),
           ('User', 'Usuario estándar');
END
ELSE
BEGIN
    PRINT 'Roles table already exists.';
END
GO


---------------------------------------------------
-- USERS TABLE
---------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Users')
BEGIN
    PRINT 'Creating Users table...';

    CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        UserGuid UNIQUEIDENTIFIER NOT NULL,
        PersonId INT NOT NULL,
        Username NVARCHAR(100) NOT NULL,
        -- HASH DE ASP.NET IDENTITY (NO NECESITA SALT)
        PasswordHash NVARCHAR(MAX) NOT NULL,
        PasswordSalt NVARCHAR(MAX) NULL,
        RoleId INT NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        FOREIGN KEY(PersonId) REFERENCES Persons(PersonId),
        FOREIGN KEY(RoleId) REFERENCES Roles(RoleId)
    );
END
ELSE
BEGIN
    PRINT 'Users table already exists.';
END
GO


---------------------------------------------------
-- INSERTAR DATA DE EJEMPLO (SOLO SI LA TABLA ESTÁ VACÍA)
---------------------------------------------------

---------------------------------------------------
-- PERSONS SEED DATA (4 registros)
---------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM Persons)
BEGIN
    PRINT 'Inserting default Persons...';

    INSERT INTO Persons (FirstName, LastName, Email, CountryCode, PhoneNumber, Age, Address, PhotoUrl)
    VALUES
    ('Carlos', 'Pérez', 'carlos.perez@example.com', '+593', '099111222', 30, 'Av. Amazonas 123', NULL),
    ('María', 'Lopez', 'maria.lopez@example.com', '+593', '099333444', 28, 'Calle Chile 456', NULL),
    ('Juan', 'García', 'juan.garcia@example.com', '+593', '098555666', 35, 'Av. Eloy Alfaro 789', NULL),
    ('Luisa', 'Martinez', 'luisa.martinez@example.com', '+593', '097777888', 22, 'Av. 6 de Diciembre 321', NULL);
END
ELSE
BEGIN
    PRINT 'Persons already contain data. Skipping seed.';
END
GO


---------------------------------------------------
-- USERS SEED DATA (4 registros)
-- PasswordHash y PasswordSalt deben ser bytes válidos.
-- Se colocan hashes falsos (solo para prueba). En producción se reemplazan.
---------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM Users)
BEGIN
    PRINT 'Inserting default Users...';

    INSERT INTO Users (UserGuid, PersonId, Username, PasswordHash, PasswordSalt, RoleId, IsActive)
    VALUES
    (NEWID(), 1, 'carlosUser', 'AQAAAAIAAYagAAAAED1OsVLjniIkSCOcC2PQJHEJ4hUPvbwt4tr2iPnw0QswtBGEr7z2YMWNMnoFWlwRNQ==', 0x0202, 1, 1),
    (NEWID(), 2, 'mariaUser', 'AQAAAAIAAYagAAAAEC925lMsRUMH8uC9vOmkwMojxfsMQkINPRakYUIa2SBgQyeYCMUqFtxYpFUS/IN/4g==', 0x0202, 2, 1),
    (NEWID(), 3, 'juanUser', 'AQAAAAIAAYagAAAAEHgFMN5etq2si7z1Cm48Ez7LKhr5mZnV3l+S1M9Zg+sMQD966XUMVgZ931Xm5JrDuw==', 0x0202, 2, 1),
    (NEWID(), 4, 'luisaUser', 'AQAAAAIAAYagAAAAELDfclN44AHmj8pYMQ+XPhq9cPjygJD/c6pGlvD52QDsrvLmEHcUIhNcvIfAbHbyqg==', 0x0202, 2, 1);
END
ELSE
BEGIN
    PRINT 'Users already contain data. Skipping seed.';
END
GO
PRINT 'Database initialization completed.';