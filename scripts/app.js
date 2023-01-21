
    fetch("../data.json")
    .then((res) => res.json())
    .then((data) => {

        const productosBDD = data;

        let carrito = [];

        function pintarProductos() {

            const tarjetas = document.querySelector(".cards");
    
            productosBDD.forEach((p) => {
    
                const contenedor = document.createElement("div");
                contenedor.classList.add("card", "col-sm-4");
                
                const body = document.createElement("div");
                body.classList.add("card-body");

                const imagenComida = document.createElement("img");
                imagenComida.classList.add("img-fluid");
                imagenComida.setAttribute("src", p.imagen);
                body.appendChild(imagenComida);

                const titulo = document.createElement("h5");
                titulo.classList.add("card-title");
                titulo.textContent = p.nombre;
                body.appendChild(titulo);
                
                const precioComida = document.createElement("p");
                precioComida.classList.add("card-text");
                precioComida.textContent = `$${p.precio}`;
                body.appendChild(precioComida);
                
                const botonAgregar = document.createElement("button");
                botonAgregar.classList.add("btn", "btn-primary");
                botonAgregar.textContent = "Agregar";
                botonAgregar.setAttribute("id", p.id); 
                botonAgregar.addEventListener("click", agregarProductoAlCarrito);
                body.appendChild(botonAgregar);
                
                contenedor.appendChild(body);
                tarjetas.appendChild(contenedor); 
            });
        }


        function agregarProductoAlCarrito(e) {
            const item = e.target.getAttribute("id");
            carrito.push(item);
            pintarProductosCarrito();
            const aJson = JSON.stringify(carrito);
            localStorage.setItem("Items Carrito", aJson);
        }


        const carritoHTML = document.querySelector(".carrito");
        const botones = document.querySelector(".botones");

        function mostrarBotones(){
            if (carrito.length >= 1 && botones.childNodes.length === 0) {
                
                const btnVaciar = document.createElement("button")
                btnVaciar.classList.add("btn", "btn-danger");
                btnVaciar.textContent = "Vaciar";     
                btnVaciar.addEventListener("click", ()=>{
                    carrito = [];
                    pintarProductosCarrito();
                    localStorage.clear();
                }); 

                botones.appendChild(btnVaciar);

                const btnPagar = document.createElement("button")
                btnPagar.classList.add("btn", "btn-secondary");
                btnPagar.style.marginLeft = "2em";
                btnPagar.textContent = "Pagar";     
                btnPagar.addEventListener("click", ()=>{
                    Toastify({
                        text: "¡Muchas gracias por su compra!",
                        duration: 3000,
                        close: true,
                        gravity: "top", 
                        position: "left",
                        stopOnFocus: true, 
                        style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                        onClick: function(){} 
                    }).showToast();

                        carrito = [];
                        pintarProductosCarrito();
                        localStorage.clear();
                }); 

                botones.appendChild(btnPagar);

            } else if (carrito.length === 0) {
                botones.textContent = "";
            }
        }


        const sumaTotalHTML = document.querySelector("#sumaTotal");

        function pintarProductosCarrito() {
            carritoHTML.textContent = "";
            const nuevoCarrito = [...new Set(carrito)];

            nuevoCarrito.forEach((p) => {
                let elemento = productosBDD.filter(elementoBDD => {
                    if(elementoBDD.id === parseInt(p)){
                        return p;
                    }
                });

                function contarComida (total, IDcomida){
                    if(IDcomida === p){
                        return total += 1;
                    } else {
                        return total;
                    }
                }
                const cantidadComida = carrito.reduce(contarComida, 0);

                const itemCarritoHTML = document.createElement("div");
                itemCarritoHTML.style.marginTop = "1em"; 
                itemCarritoHTML.style.marginLeft = "3.5em"; 
                itemCarritoHTML.style.marginBottom = '0.3em'; 
                itemCarritoHTML.style.border = "1px gainsboro solid";
                itemCarritoHTML.style.padding = "0.5em";

                itemCarritoHTML.textContent = `${cantidadComida} x ${elemento[0].nombre} - $${elemento[0].precio}`;

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn", "btn-danger");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.style.marginLeft = "3em";
                btnEliminar.setAttribute("id", p);
                btnEliminar.addEventListener("click", borrarItemCarrito);

                itemCarritoHTML.appendChild(btnEliminar);
                carritoHTML.appendChild(itemCarritoHTML);
            });

            let totalProductos = calcularTotal()
            sumaTotalHTML.textContent = totalProductos;
            mostrarBotones();
        }


        function borrarItemCarrito(e) {
            const id = e.target.getAttribute("id");

            carrito = carrito.filter(carritoId => {
                if(carritoId !== id){
                    return carritoId;
                }
            });

            pintarProductosCarrito();
            const aJson = JSON.stringify(carrito);
            localStorage.setItem("Items Carrito", aJson);
        }


        function calcularTotal() {
            function encontrarPrecio(total, elemento){
                const comidasCarrito = productosBDD.filter(itemBDD => {
                    if(itemBDD.id === parseInt(elemento)){
                        return itemBDD.id;
                    }
                });
                return total + comidasCarrito[0].precio;
            }
            const suma = carrito.reduce(encontrarPrecio, 0).toFixed(0);
            return suma;
        }


    function obtenerDatosStorage(){
        carrito = JSON.parse(localStorage.getItem('Items Carrito')) || [];
    }


        obtenerDatosStorage();
        pintarProductos();
        pintarProductosCarrito();

    });


