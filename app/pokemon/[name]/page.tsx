import Image from "next/image";

interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface PokemonData {
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
}

interface PageProps {
  params: Promise<{ name: string }>;
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-slate-400",
  fairy: "bg-pink-300",
};

async function getPokemon(name: string): Promise<PokemonData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!res.ok) {
    throw new Error("Pokemon not found");
  }

  return res.json();
}

export async function generateMetadata({ params }: PageProps) {
  const { name } = await params;
  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} - Pokemon Search`,
  };
}

export default async function PokemonPage({ params }: PageProps) {
  const { name } = await params;

  let pokemon: PokemonData;
  let error: string | null = null;

  try {
    pokemon = await getPokemon(name);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load Pokemon";
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <p className="mt-2 text-gray-500">
            Could not find Pokemon: <span className="font-semibold">{name}</span>
          </p>
        </div>
      </main>
    );
  }

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-8 capitalize text-center">
          {pokemon.name}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Image */}
          <div className="flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={pokemon.name}
                width={250}
                height={250}
                priority
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}
          </div>

          {/* Details */}
          <div className="flex-grow w-full">
            {/* Types */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Types</h2>
              <div className="flex gap-2">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`px-3 py-1 text-white rounded-full text-sm capitalize ${typeColors[t.type.name] || "bg-gray-500"}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Physical */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Physical</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Height: {(pokemon.height / 10).toFixed(1)} m
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Weight: {(pokemon.weight / 10).toFixed(1)} kg
              </p>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Stats</h2>
              <div className="space-y-2">
                {pokemon.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{s.stat.name.replace("-", " ")}</span>
                      <span>{s.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
