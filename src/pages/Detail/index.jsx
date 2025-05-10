import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import straighten from "../../assets/straighten.svg";
import weight from "../../assets/weight.svg";

// Mapeo de colores por tipo de Pokémon
const typeColors = {
  grass: "bg-green-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  bug: "bg-lime-500",
  poison: "bg-purple-500",
  electric: "bg-yellow-400",
  normal: "bg-gray-400",
  ground: "bg-amber-700",
  fairy: "bg-pink-400",
  psychic: "bg-pink-600",
  fighting: "bg-orange-700",
  rock: "bg-yellow-700",
  ghost: "bg-indigo-700",
  ice: "bg-cyan-300",
  dragon: "bg-indigo-900",
  steel: "bg-gray-500",
  dark: "bg-zinc-800",
  flying: "bg-sky-400",
};

// Pokéball decorativa
const pokeballSVG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

export default function Detail() {
  const { pokemonName } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");

  const fetchPokemonData = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) throw new Error("Error al obtener el Pokémon");
      const data = await response.json();
      setPokemon(data);
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      // Buscar descripción en español (o inglés si no hay)
      const descEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === "es"
      ) || speciesData.flavor_text_entries.find(
        entry => entry.language.name === "en"
      );

      setDescription(descEntry?.flavor_text.replace(/[\n\f]/g, " ") || "Descripción no disponible");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, [pokemonName]);

  if (!pokemon) return <p className="text-center mt-10">Cargando...</p>;

  const bgColor = typeColors[pokemon.types[0].type.name] || "bg-gray-500";
  const textColor = bgColor.replace('bg-', 'text-');

  return (
    <div className="max-w-md mx-auto bg-gray-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header con color de tipo */}
      <div className={`${bgColor} text-white p-6 relative rounded-b-3xl`}>
        {/* Botón atrás */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-xl"
        >
          ←
        </button>
        {/* Nombre y número */}
        <h1 className="text-3xl font-bold capitalize text-center">{pokemon.name}</h1>
        <p className="absolute top-4 right-6 text-sm font-bold">
          #{String(pokemon.id).padStart(3, "0")}
        </p>
        {/* Imagen del Pokémon */}
        <div className="w-full flex justify-center -mb-16 z-10 relative">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>
      {/* Contenedor principal de detalles */}
      <div className="bg-white rounded-t-3xl pt-24 pb-10 px-6 text-center">
        {/* Sección de Tipos - Posicionada correctamente */}
        <div className="mb-6 -mt-6">
          <div className="flex justify-center gap-3">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`px-4 py-2 rounded-full text-white text-sm font-semibold capitalize ${typeColors[t.type.name] || "bg-gray-400"
                  }`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
        {/* About */}
        <h2 className={`${textColor} font-bold text-lg mb-4`}>About</h2>
        <section className="mt-4 flex justify-between text-sm font-light text-center mb-10">
                  <div className="flex-1">
                    <p className="flex justify-center gap-2 items-center">
                      <img width={16} src={weight} alt="" />
                      <span>{pokemon.weight} kg</span>
                    </p>
                    <p className="mt-4">Weight</p>
                  </div>
                  <div className="border-x flex-1 border-gray-300">
                    <p className="flex justify-center gap-2 items-center">
                      <img width={16} src={straighten} alt="" />
                      <span>{pokemon.height / 10} m</span>
                    </p>
                    <p className="mt-4">Height</p>
                  </div>
                  <div className="flex-1">
                    <p>
                      {pokemon.moves.splice(0, 2).map((item) => (
                        <p className="text-xs capitalize">{item.move.name}</p>
                      ))}
                    </p>
                    <p className="mt-1">Moves</p>
                  </div>
                </section>
          <p className="text-gray-600 text-sm mb-6 italic">
          {description || "Descripción no disponible"}
        </p>

        {/* Stats */}
        <h2 className={`${textColor} font-bold text-lg mb-4`}>Base Stats</h2>
        <div className="text-left space-y-3">
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name}>
              <div className="flex justify-between text-sm font-semibold">
                <span className="capitalize">{stat.stat.name}</span>
                <span>{String(stat.base_stat).padStart(3, "0")}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-400"
                  style={{ width: `${(stat.base_stat / 150) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}