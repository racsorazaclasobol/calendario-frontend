# Calendar APP

## Pasos para configurar proyecto

1. Clona los proyectos de front y backend

- Front-end
```bash
git clone https://github.com/racsorazaclasobol/calendario-frontend.git
```

- Back-end
```bash
git clone https://github.com/racsorazaclasobol/calendario-backend.git
```

2. Instala dependencias

    - Ingresa en la raiz del front-end y ejecuta
    ```bash
    yarn
    ```

3. Renombrar el archivo .env.template por .env.

4. Hacer las configuraciones respectivas en las variables de entorno.

```
VITE_MODE = << dev, prod, test, qa >>
VITE_API_URL = << RUTA DE API DEL BACKEND >>
```