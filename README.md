# Proyecto Backend — Productos y Carrito

Este proyecto implementa un backend con **Express**, vistas con **Handlebars**, y actualización en tiempo real usando **WebSockets**.

---

## Variables de entorno

Para poder correr la aplicación correctamente, es necesario crear un archivo .env en la raíz del proyecto. Este archivo debe generarse a partir de .env.example y completarse con los valores correspondientes a cada entorno (credenciales, secretos y configuraciones). El archivo .env no se incluye en el repositorio por motivos de seguridad.

---

## Rutas Principales

### **`/`**
Muestra los productos actuales renderizados desde `home.handlebars`.

### **`/realtimeproducts`**
Vista donde los productos se actualizan **en tiempo real** cuando se agrega, modifica o elimina un producto, renderizados desde `realTimeProducts.handlebars`

---

## Rutas de Carrito — `/api/carts`

### **POST `/api/carts/`**
Crea un carrito nuevo.

### **GET `/api/carts/:cid`**
Obtiene los productos de un carrito según su ID.

### **POST `/api/carts/:cid/product/:pid`**
Agrega un producto al carrito indicado, siempre y cuando el usuario al que pertenece el carrito sea el que esta logueado.

### **DELETE `/api/carts/:cid/product/:pid`**
Elimina el producto del carrito por completo (aunque haya mas de uno)

### **DELETE `/api/carts/:cid`**
Elimina todos los productos del carrito

### **PUT `/api/carts/:cid`**
Recibe un arreglo de productos desde el body de la request y sobreescribe el arreglo actual del carrito
Se deben recibir en el siguiente formato [{"productId": "productId", "quantity": quantity},{"productId": "productId", "quantity": quantity},...]

### **PUT `/api/carts/:cid/product/:pid`**
Recibe desde el body { "quantity": x } y actualiza la cantidad de dicho producto en el carrito

### **POST `/api/carts/:cid/buy`**
Realiza la compra de un carrito, siempre y cuando el usuario a quien pertenece el carrito este logueado y todos los productos del carrito esten disponibles en las cantidades indicadas. Devuelve el ticket de compra. 

---

## Rutas de Productos — `/api/products`

### **GET `/api/products/`**
Devuelve todos los productos.
Se agrega la posibilidad de pasar como query params: limit, page, sort y query - todos parámetros opcionales.
Se simula la paginación con dichos parámetros, en caso de no estar presentes limit y page se setean a 10 y 1 respectivamente.
Sort toma el valor de 1 o -1 para ordenar los resultados de manera ascendente o descendente en relación a su precio.
El parámetro query lo usamos como filtro, se debe enviar como valor del mismo el siguiente formato atributo:valor para filtrar los productos
según cualquiera de los atributos presentes en ellos.
La respuesta de este endpoint ahora devuelve todos los datos de paginación solicitados.

### **GET `/api/products/:pid`**
Devuelve un producto por su ID.

### **POST `/api/products/`**
Crea un producto nuevo, siempre y cuando el usuario logueado sea un administrador.

### **PUT `/api/products/:pid`**
Modifica un producto existente, siempre y cuando el usuario logueado sea un administrador.

### **DELETE `/api/products/:pid`**
Elimina un producto, siempre y cuando el usuario logueado sea un administrador.

---

## Rutas de Usuarios — `/api/sessions`

### **POST `/api/sessions/register`**
Crea un usurio nuevo con los datos enviados en el body de la request, el body debe ser un json con la siguiente información:
{
  first_name,
  last_name,
  email,
  password,
  age,
  role
}
Los datos requeridos para poder crear el usuario son: first_name, last_name, email y password. La edad es opcional y en caso de no indicar un rol específico para el usuario, el sistema asignará por defecto el rol "user". Además el sistema va a crear un carrito vacío y asignar el id del mismo al usuario para que luego pueda comenzar a usarlo. 

### **POST `/api/sessions/login`**
Permite a un usuario autenticarse, el mismo debe proveer email y contraseña en el siguiente formato json:
{
  email,
  password
}

### **GET `/api/sessions/current`**
En caso de haber usuario autenticado, devuelve el username (email) y rol del mismo.

---

## Vistas

### **`/` (Home)**
- Renderiza la lista actual de productos.
- Los productos provienen del endpoint `/api/products`.

### **`/realtimeproducts`**
- Muestra los productos.
- Se actualizan automáticamente en tiempo real cuando se ejecutan las rutas:
  - **POST** → agregar producto
  - **PUT** → modificar producto
  - **DELETE** → eliminar producto
