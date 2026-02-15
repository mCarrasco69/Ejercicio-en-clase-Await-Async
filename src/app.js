const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

function readJson() {
    const data = fs.readFileSync('../data/products.json', 'utf-8');
    return JSON.parse(data);
}

function writeJson(data) {
    fs.writeFileSync('../data/products.json', JSON.stringify(data, null, 2));
}

// GET - Get all products
app.get('/products', (req, res) => {
    const products = readJson();
    res.json(products);
});

// GET - Get product by ID
app.get('/products/:id', (req, res) => {
    const products = readJson();
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
});

// POST - Insert product
app.post('/products', (req, res) => {
    const products = readJson();
    const newProduct = req.body;

    if (!newProduct.id || !newProduct.name || !newProduct.price) {
        return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const exists = products.find(p => p.id === newProduct.id);
    if (exists) {
        return res.status(400).json({ message: "Producto ya existe" });
    }

    products.push(newProduct);
    writeJson(products);

    res.status(201).json({ message: "Producto creado exitosamente" });
});

// PUT - Update product
app.put('/products/:id', (req, res) => {
    const products = readJson();
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    products[index] = { ...products[index], ...updatedData };
    writeJson(products);

    res.json({ message: "Producto actualizado exitosamente" });
});

// DELETE - Delete product
app.delete('/products/:id', (req, res) => {
    const products = readJson();
    const id = parseInt(req.params.id);

    const newProducts = products.filter(p => p.id !== id);

    if (newProducts.length === products.length) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    writeJson(newProducts);

    res.json({ message: "Producto eliminado exitosamente" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
