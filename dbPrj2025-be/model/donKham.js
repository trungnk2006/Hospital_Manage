const { sequelize } = require("../databaseConnection");
const { DataTypes } = require("sequelize");

const DonKham = sequelize.define(
	"donKham",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		bacSiId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "thongtincanhans", // must match table name
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		benhNhanId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "thongtincanhans", // again, same table
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		lichKhamId: DataTypes.INTEGER,
		benhLy: DataTypes.STRING,
		mucDoBenh: DataTypes.STRING,
		dieuTri: DataTypes.STRING,
	},
	{
		timestamps: true,
		tableName: "donkhams",
	}
);

// (async () => {
//   await DonKham.sync({ alter: true })
// })();

module.exports = DonKham;
