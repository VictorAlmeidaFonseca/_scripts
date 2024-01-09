import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize({
  storage: "src/db/data/database.sqlite",
  dialect: "sqlite",
});


export const Person = sequelize.define(
  "Person",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Persons",
  }
);

export const Role = sequelize.define(
  "Role",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Roles",
  }
);

export const PersonRoles = sequelize.define(
  "PersonRoles",
  {
    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    tableName: "PersonRoles",
  }
);

export const Assignment = sequelize.define(
  "Assignment",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.INTEGER,
    },
    week: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    person: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Assignment",
  }
);

// Person.belongsToMany(Role, { through: PersonRoles });
// Role.belongsToMany(Person, { through: PersonRoles });

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });
