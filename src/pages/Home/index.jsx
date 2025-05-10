// Importamos los hooks necesarios de React y el componente Link para navegación
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Definimos el componente principal Home
export default function Home() {
  // Estado para almacenar la lista de pokémons
  const [pokemons, setPokemons] = useState([]);

  // Función asíncrona para obtener los pokémons de la API
  const getPokemons = async () => {
    try {
      // URL de la API de Pokémon
      const url = "https://pokeapi.co/api/v2/pokemon/";
      // Hacemos la petición fetch y esperamos la respuesta
      const response = await fetch(url);

      // Si la respuesta no es OK (status no está en el rango 200-299)
      if (response.ok === false) {
        // Lanzamos un error manualmente
        throw new Error("Error del Servidor");
      }

      // Convertimos la respuesta a JSON
      const data = await response.json();
      // Actualizamos el estado con los resultados
      setPokemons(data.results);
    } catch (error) {
      // Capturamos y mostramos cualquier error que ocurra
      console.log(error);
    }
  };

  // Efecto que se ejecuta al montar el componente (por el array de dependencias vacío)
  useEffect(() => {
    getPokemons();
  }, []);

  // Renderizado del componente
  return (
    <main>
      {/* Sección del título */}
      <section className="text-center">
        <h1 className="text-red-500 xl:text-green-500 text-3xl my-5">
          PokeApi
        </h1>
      </section>
      
      {/* Sección de los pokémons */}
      <section className="pokemons-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {/* Mapeamos cada pokémon para renderizar su tarjeta */}
        {pokemons.map((pokemon, index) => (
          <Link
            // Link para navegar a la página de detalles del pokémon
            to={`/pokemon/${pokemon.name}`}
            // Key única para cada elemento (usamos el index)
            key={index}
            // Estilos de la tarjeta
            className="border border-gray-300 p-5 rounded-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            {/* Contenedor de la imagen con tamaño fijo */}
            <div className="h-40 w-40 flex items-center justify-center">
              <img
                // URL de la imagen del pokémon (usamos dream-world sprites)
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                  index + 1
                }.svg`}
                // Texto alternativo con el nombre del pokémon
                alt={pokemon.name}
                // Estilos para la imagen (object-contain mantiene la relación de aspecto)
                className="h-full w-full object-contain"
                // Imagen de respaldo en caso de error (algunos SVG de dream-world pueden fallar)
                onError={(e) => {
                  e.target.onerror = null; // Prevenimos bucles de error
                  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                    index + 1
                  }.png`;
                }}
              />
            </div>
            {/* Nombre del pokémon (capitalizado) */}
            <h3 className="text-center capitalize text-xl font-semibold mt-2">
              {pokemon.name}
            </h3>
          </Link>
        ))}
      </section>
    </main>
  );
}