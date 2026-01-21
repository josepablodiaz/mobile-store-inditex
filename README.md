# Mobile Store SPA

Esta es la prueba técnica para el desarrollo de la tienda de móviles. Es una SPA sencilla hecha con React y Vite.

## Cómo arrancar el proyecto

Necesitas Node.js (v20 o superior recomendado).

1.  **Instala las dependencias:**
    ```bash
    npm install
    ```

2.  **Arranca en local:**
    ```bash
    npm start
    ```
    Se abrirá en `http://localhost:5173`.

3.  **Otros comandos útiles:**
    *   `npm run build`: Para generar la versión de producción en `/dist`.
    *   `npm run lint`: Para revisar que el código sigue las reglas de estilo (ESLint).
    *   `npm test`: Para pasar los tests unitarios con Vitest.

---

## Sobre la solución

He decidido usar **React 19** con **Vite** porque ahora mismo es lo más rápido para configurar y desarrollar. Aunque lo normal sería usar TypeScript, me he ceñido a los requisitos y está todo en **JavaScript (ES6+)**.

### Estructura del código
He intentado que sea lo más intuitiva posible:

*   `src/hooks`: Aquí he metido toda la lógica de negocio (`useApi` para las llamadas y `useCache` para el almacenamiento). Así los componentes quedan limpios.
*   `src/context`: Uso Context API para el carrito. Para una app de este tamaño, meter Redux me parecía matar moscas a cañonazos.
*   `src/components`: Componentes reutilizables "tontos" (solo pintan datos).
*   `src/pages`: Las vistas principales que conectan todo.

### Decisiones de diseño
*   **Sin frameworks de CSS**: He usado CSS plano (con variables y módulos) para demostrar que se puede maquetar un diseño limpio y responsive (tipo "Premium") sin depender de Tailwind o Bootstrap.
*   **Persistencia**: El carrito y la caché de la API se guardan en `localStorage` (1 hora de expiración para la API), así que si recargas la página no pierdes nada.
*   **API**: Aunque la gestión del carrito es local para que sea inmediata (Optimistic UI), por debajo hago la llamada POST a la API tal como pedía el enunciado.

Cualquier duda, el código está comentado donde hace falta.
