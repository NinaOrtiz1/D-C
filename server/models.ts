import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["admin", "editor", "cliente"], default: "cliente" },
    role: { type: String, enum: ["admin", "editor", "cliente"], default: "cliente" },
    telefono: { type: String, default: "" },
    phone: { type: String, default: "" },
    foto: { type: String, default: "" },
    avatar: { type: String, default: "" },
    activo: { type: Boolean, default: true },
    ultimoLogin: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true },
);

const categorySchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    descripcion: { type: String, default: "" },
    description: { type: String, default: "" },
    imagen: { type: String, default: "" },
    image: { type: String, default: "" },
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const productSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    descripcion: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    categoria: { type: Schema.Types.ObjectId, ref: "Category" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    marca: { type: String, default: "" },
    brand: { type: String, default: "" },
    modelo: { type: String, default: "" },
    model: { type: String, default: "" },
    imagenes: [{ type: String }],
    images: [{ type: String }],
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const commentSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    producto: { type: Schema.Types.ObjectId, ref: "Product" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    nombre: { type: String, default: "" },
    email: { type: String, default: "" },
    comentario: { type: String, required: true, trim: true },
    comment: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    aprobado: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const sliderSchema = new Schema(
  {
    titulo: { type: String, default: "" },
    title: { type: String, default: "" },
    descripcion: { type: String, default: "" },
    description: { type: String, default: "" },
    imagen: { type: String, required: true },
    image: { type: String },
    botonTexto: { type: String, default: "Ver más" },
    buttonText: { type: String, default: "Ver más" },
    botonLink: { type: String, default: "/" },
    buttonLink: { type: String, default: "/" },
    orden: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const bannerSchema = new Schema(
  {
    titulo: { type: String, default: "" },
    title: { type: String, default: "" },
    descripcion: { type: String, default: "" },
    description: { type: String, default: "" },
    imagen: { type: String, required: true },
    image: { type: String },
    enlace: { type: String, default: "/" },
    link: { type: String, default: "/" },
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const newsSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    contenido: { type: String, required: true },
    content: { type: String },
    imagen: { type: String, default: "" },
    image: { type: String, default: "" },
    autor: { type: String, default: "" },
    author: { type: String, default: "" },
    fecha: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const faqSchema = new Schema(
  {
    pregunta: { type: String, required: true, trim: true },
    question: { type: String, trim: true },
    respuesta: { type: String, required: true },
    answer: { type: String },
    imagen: { type: String, default: "" },
    image: { type: String, default: "" },
    orden: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const socialNetworkSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    platform: { type: String, trim: true },
    url: { type: String, required: true },
    enlace: { type: String },
    activo: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const siteConfigSchema = new Schema(
  {
    nombreEmpresa: { type: String, default: "D&C Innovación" },
    name: { type: String, default: "D&C Innovación" },
    logo: { type: String, default: "" },
    telefono: { type: String, default: "" },
    phone: { type: String, default: "" },
    correo: { type: String, default: "" },
    email: { type: String, default: "" },
    direccion: { type: String, default: "" },
    address: { type: String, default: "" },
    colorPrincipal: { type: String, default: "#7b1e3a" },
    colorSecundario: { type: String, default: "#f4e7eb" },
    descripcion: { type: String, default: "" },
    description: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const contactSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    telefono: { type: String, default: "" },
    phone: { type: String, default: "" },
    correo: { type: String, default: "" },
    email: { type: String, default: "" },
    mensaje: { type: String, required: true },
    message: { type: String },
    origen: { type: String, default: "web" },
    origin: { type: String, default: "web" },
    leido: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    status: { type: String, enum: ["nuevo", "leido", "cerrado"], default: "nuevo" },
  },
  { timestamps: true },
);

const activityLogSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    accion: { type: String, required: true },
    action: { type: String },
    recurso: { type: String, default: "" },
    resource: { type: String, default: "" },
    recursoId: { type: String, default: "" },
    resourceId: { type: String, default: "" },
    fecha: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

const loginHistorySchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    fecha: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    exitoso: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
  },
  { timestamps: true },
);


export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export const Slider = mongoose.models.Slider || mongoose.model("Slider", sliderSchema);
export const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export const News = mongoose.models.News || mongoose.model("News", newsSchema);
export const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
export const SocialNetwork =
  mongoose.models.SocialNetwork || mongoose.model("SocialNetwork", socialNetworkSchema);
export const SiteConfig =
  mongoose.models.SiteConfig || mongoose.model("SiteConfig", siteConfigSchema);
export const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
export const LoginHistory =
  mongoose.models.LoginHistory || mongoose.model("LoginHistory", loginHistorySchema);

export type UserType = InferSchemaType<typeof userSchema>;
export type ProductType = InferSchemaType<typeof productSchema>;
export type CategoryType = InferSchemaType<typeof categorySchema>;
export type CommentType = InferSchemaType<typeof commentSchema>;
export type SliderType = InferSchemaType<typeof sliderSchema>;
export type BannerType = InferSchemaType<typeof bannerSchema>;
export type NewsType = InferSchemaType<typeof newsSchema>;
export type FAQType = InferSchemaType<typeof faqSchema>;
export type SocialNetworkType = InferSchemaType<typeof socialNetworkSchema>;
export type SiteConfigType = InferSchemaType<typeof siteConfigSchema>;
export type ContactType = InferSchemaType<typeof contactSchema>;
export type ActivityLogType = InferSchemaType<typeof activityLogSchema>;
export type LoginHistoryType = InferSchemaType<typeof loginHistorySchema>;
