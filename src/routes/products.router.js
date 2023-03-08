import express from "express";
import ProductManager from "../ProductManager.js";

const router = express.Router();
const productManager = new ProductManager("./products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();

  const { limit } = req.query;

  if (limit) {
    return res.send(products.slice(0, Number(limit)));
  }

  res.send({ data: products });
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    res.status(404).send({ error: "Missing input data for product creation" });
  }

  const newProduct = await productManager.addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );

  res.status(201).send({ data: newProduct });
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).send({ error: `Product with ID ${pid} not found` });
  }

  res.send({ data: product });
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    status === undefined ||
    !stock ||
    !category
  ) {
    res.status(400).send({ error: "Missing input data for product creation" });
  }

  await productManager.updateProduct(pid, req.body);

  res.send({ data: "ok" });
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  await productManager.deleteProduct(pid);

  res.send({ data: "ok" });
});

export default router;
