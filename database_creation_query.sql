DROP DATABASE Accounting2
CREATE DATABASE Proj
ON
(NAME = 'Proj',
FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\ProjData.mdf',
SIZE = 10,
MAXSIZE = 50,
FILEGROWTH = 5)
LOG ON
(NAME = 'ProjLog',
FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\ProjLog.ldf',
SIZE = 5MB,
MAXSIZE = 25MB,
FILEGROWTH = 5MB);
GO

CREATE TABLE Student(
	id INT PRIMARY KEY,
	pw VARCHAR(16) NOT NULL,
	fname VARCHAR(30) NOT NULL,
	lname VARCHAR(30) NOT NULL
)

CREATE TABLE Teacher(
	id INT PRIMARY KEY,
	pw VARCHAR(16) NOT NULL,
	fname VARCHAR(30) NOT NULL,
	lname VARCHAR(30) NOT NULL
)

CREATE TABLE Course(
	id INT PRIMARY KEY,
	cname VARCHAR(20) NOT NULL,
	tid INT NOT NULL,
	CONSTRAINT FK_tid_in_course FOREIGN KEY (tid) 
								REFERENCES dbo.Teacher(id)
								ON DELETE CASCADE
								ON UPDATE NO ACTION,
)


CREATE TABLE Assignment(
	id INT PRIMARY KEY,
	aname VARCHAR(300) NOT NULL,
	cid INT NOT NULL,
	
	Q1_title VARCHAR(200) NULL,
	Q1_weight INT DEFAULT 0,

	Q2_title VARCHAR(200) NULL,
	Q2_weight INT DEFAULT 0,
	
	Q3_title VARCHAR(200) NULL,
	Q3_weight INT DEFAULT 0,
	
	Q4_title VARCHAR(200) NULL,
	Q4_weight INT DEFAULT 0,
	
	Q5_title VARCHAR(200) NULL,
	Q5_weight INT DEFAULT 0,

	CONSTRAINT FK_cid_in_assignment FOREIGN KEY (cid)
									REFERENCES dbo.Course(id)
									ON UPDATE NO ACTION
									ON DELETE CASCADE,
)

CREATE TABLE StuAssignment(
	sid INT NOT NULL,
	aid INT NOT NULL,

	Q1_answer VARCHAR(200) NULL,
	Q1_score INT DEFAULT 0,

	Q2_answer VARCHAR(200) NULL,
	Q2_score INT DEFAULT 0,
	
	Q3_answer VARCHAR(200) NULL,
	Q3_score INT DEFAULT 0,
	
	Q4_answer VARCHAR(200) NULL,
	Q4_score INT DEFAULT 0,
	
	Q5_answer VARCHAR(200) NULL,
	Q5_score INT DEFAULT 0,

	isSubmitted INT DEFAULT 0 ,
	marked INT DEFAULT 0,
	final FLOAT DEFAULT 0.0,

	CONSTRAINT PK_StuAssginment PRIMARY KEY(aid, sid),
	
	CONSTRAINT FK_aid_in_StuAssignment FOREIGN KEY (aid)
									   REFERENCES dbo.Assignment(id)
									   ON UPDATE NO ACTION
									   ON DELETE CASCADE,
	CONSTRAINT FK_sid_in_StuAssignment FOREIGN KEY (sid)
									   REFERENCES dbo.Student(id)
									   ON UPDATE NO ACTION
									   ON DELETE CASCADE,

	CONSTRAINT Check_submitted CHECK (isSubmitted = 0 OR isSubmitted = 1),
	CONSTRAINT Check_marked CHECK(marked = 0 OR marked = 1)
)

CREATE TABLE CourseInfo(
	sid INT NOT NULL,
	cid INT NOT NULL,
	CONSTRAINT PK_CourseInfo PRIMARY KEY (sid, cid),
	CONSTRAINT FK_sid_in_CourseInfo FOREIGN KEY (sid)
									REFERENCES dbo.Student(id)
									ON UPDATE NO ACTION
									ON DELETE CASCADE,
	CONSTRAINT FK_cid_in_CourseInfo FOREIGN KEY (cid)
									REFERENCES dbo.Course(id)
									ON UPDATE NO ACTION
									ON DELETE CASCADE,
)