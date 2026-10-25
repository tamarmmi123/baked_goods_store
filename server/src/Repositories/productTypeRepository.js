const pool = require("../config/db");
const ProductType = require("../models/ProductType");

exports.findByProductId = async (productId) => {
    const result = await pool.query(
        "SELECT * FROM product_types WHERE product_id = $1",
        [productId]
    );
    return result.rows.map(
        (row) =>
            new ProductType({
                id: row.id,
                product_id: row.product_id,
                type_label: row.type_label,
                image_url: row.image_url,
                description: row.description,
            })  
    );
};
exports.createType = async (productId, typeLabel, imageUrl, description) => {
    const result = await pool.query(
        `INSERT INTO product_types (product_id, type_label, image_url, description)
            VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [productId, typeLabel, imageUrl, description]
    );
    const row = result.rows[0];
    return new ProductType({
        id: row.id,
        product_id: row.product_id, 
        type_label: row.type_label,
        image_url: row.image_url,
        description: row.description,
    });
};

exports.deleteTypesByProductId = async (productId) => {
    await pool.query("DELETE FROM product_types WHERE product_id = $1", [
        productId,
    ]);
}

