-- Создаем базу данных
CREATE DATABASE IF NOT EXISTS project_management;
USE project_management;

-- Таблица отделов
CREATE TABLE Department (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName VARCHAR(255) NOT NULL
);

-- Таблица сотрудников
CREATE TABLE Employee (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentID INT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    MiddleName VARCHAR(255),
    Position VARCHAR(255),
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

-- Таблица клиентов
CREATE TABLE Client (
    ClientID INT AUTO_INCREMENT PRIMARY KEY,
    ContactName VARCHAR(255) NOT NULL,
    CompanyName VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255)
);

-- Таблица проектов
CREATE TABLE Project (
    ProjectID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(255) NOT NULL,
    ClientID INT,
    ProjectManagerID INT,
    Description TEXT,
    PlannedStartDate DATE,
    PlannedEndDate DATE,
    ActualStartDate DATE,
    ActualEndDate DATE,
    PlannedBudget DECIMAL(15, 2),
    ActualBudget DECIMAL(15, 2),
    Status VARCHAR(50),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
    FOREIGN KEY (ProjectManagerID) REFERENCES Employee(EmployeeID)
);

-- Таблица оборудования
CREATE TABLE Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentName VARCHAR(255) NOT NULL,
    Description TEXT,
    SerialNumber VARCHAR(255),
    Status VARCHAR(50)
);

-- Таблица связи проектов и оборудования
CREATE TABLE ProjectEquipment (
    ProjectEquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectID INT,
    EquipmentID INT,
    DateAssigned DATE,
    DateReturned DATE,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID)
);

-- Таблица задач
CREATE TABLE Task (
    TaskID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectID INT,
    TaskName VARCHAR(255) NOT NULL,
    Description TEXT,
    AssignedTo INT,
    StartDate DATE,
    EndDate DATE,
    Status VARCHAR(50),
    EstimatedHours INT,
    ActualHours INT,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (AssignedTo) REFERENCES Employee(EmployeeID)
);

-- Таблица опросов
CREATE TABLE Survey (
    SurveyID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectID INT,
    ClientID INT,
    DateSent DATE,
    DateCompleted DATE,
    OverallSatisfaction INT,
    Comments TEXT,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID)
);

-- Таблица платежей
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectID INT,
    PaymentDate DATE,
    Amount DECIMAL(15, 2),
    PaymentMethod VARCHAR(50),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);


-- Сначала заполняем таблицу отделов
INSERT INTO Department (DepartmentName) VALUES 
('Отдел управления проектами'),
('Отдел продаж'),
('Отдел разработки'),
('Отдел закупок'),
('Администрация');

-- Затем импортируем сотрудников
-- В phpMyAdmin используйте вкладку "Импорт" для загрузки CSV файла
-- Или выполните INSERT запросы вручную:

INSERT INTO Employee (DepartmentID, FirstName, LastName, MiddleName, Position) VALUES
(1, 'Ольга', 'Шевченко', 'Викторовна', 'Руководитель отдела'),
(1, 'Ирина', 'Мазалова', 'Львовна', 'Ведущий инженер'),
(1, 'Юрий', 'Семеняка', 'Геннадьевич', 'Ведущий инженер'),
(1, 'Олег', 'Савельев', 'Иванович', 'Ведущий инженер'),
(2, 'Эдуард', 'Бунин', 'Михайлович', 'Руководитель отдела'),
(2, 'Павел', 'Бахшиев', 'Иннокентьевич', 'Менеджер по продажам'),
(2, 'Наталья', 'Тюренкова', 'Сергеевна', 'Менеджер по продажам'),
(2, 'Галина', 'Любяшева', 'Аркадьевна', 'Менеджер по продажам'),
(2, 'Петр', 'Александров', 'Константинович', 'Менеджер по продажам'),
(3, 'Ольга', 'Мазалова', 'Николаевна', 'Руководитель отдела'),
(3, 'Виктор', 'Лапшин', 'Романович', 'Инженер-программист'),
(3, 'Семен', 'Гусев', 'Петрович', 'Инженер-программист'),
(3, 'Вера', 'Гладилина', 'Михайловна', 'Инженер-программист'),
(3, 'Динара', 'Масюк', 'Викторовна', 'Инженер-программист'),
(3, 'Илья', 'Лукин', 'Федорович', 'Инженер-программист'),
(3, 'Станислав', 'Петров', 'Игоревич', 'Монтажник'),
(3, 'Марина', 'Филь', 'Федоровна', 'Монтажник'),
(3, 'Игорь', 'Михайлов', 'Вадимович', 'Монтажник'),
(4, 'Игорь', 'Габиец', 'Леонидович', 'Руководитель отдела'),
(4, 'Александр', 'Мартыненко', 'Сергеевич', 'Менеджер по закупкам'),
(4, 'Агата', 'Байчорова', 'Рустамовна', 'Менеджер по закупкам'),
(4, 'Дмитрий', 'Антоненко', 'Игоревич', 'Логист'),
(5, 'Анна', 'Устьянцева', 'Станиславовна', 'Генеральный директор'),
(5, 'Денис', 'Захарящев', 'Сергеевич', 'Коммерческий директор'),
(5, 'Ярослава', 'Третьяк', 'Викторовна', 'Секретарь');

SELECT 
    e.EmployeeID,
    CONCAT(e.LastName, ' ', e.FirstName, ' ', e.MiddleName) AS FullName,
    d.DepartmentName,
    e.Position,
    SUM(t.ActualHours) AS TotalHoursWorked,
    COUNT(DISTINCT t.ProjectID) AS ProjectsCount,
    ROUND(SUM(t.ActualHours) / 160 * 100, 2) AS WorkloadPercentage
    -- 160 часов - стандартная месячная нагрузка
FROM 
    Employee e
JOIN 
    Department d ON e.DepartmentID = d.DepartmentID
LEFT JOIN 
    Task t ON e.EmployeeID = t.AssignedTo
LEFT JOIN 
    Project p ON t.ProjectID = p.ProjectID
WHERE 
    p.Status = 'В процессе' OR p.Status IS NULL
GROUP BY 
    e.EmployeeID, FullName, d.DepartmentName, e.Position
ORDER BY 
    WorkloadPercentage DESC;