import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Provera da li je korisnik admin
  const isAdmin = user?.email === "admin@example.com";

  useEffect(() => {
    // Uzimanje sesije
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listener za promenu stanja autentifikacije
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const clearSearch = () => setSearchValue("");
  const performSearch = () => console.log("Pretraga: " + searchValue);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-3 bg-blue-900 text-white">
        {/* LOGO */}
        <div className="flex items-center">
          <img
            src="./icon/0.png"
            className="w-10 h-10 mr-2 rounded-full cursor-pointer"
          />
          <span className="text-2xl font-bold cursor-pointer">Proodaja.rs</span>
        </div>

        {/* SEARCH */}
        <div className="flex-1 mx-6 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Pretraga..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-2 rounded-full"
              >
                <img src="./icon/close.svg" className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={performSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              <img src="./icon/search.svg" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTH */}
        <div className="flex space-x-3">
          {user ? (
            <>
              <span className="px-4 py-2 rounded-full bg-gray-200 text-black">
                {isAdmin ? "Admin" : user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Odjavi se
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
              >
                Prijavi se
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 cursor-pointer"
              >
                Registruj se
              </Link>
            </>
          )}
        </div>

        {/* ICONS */}
        <div className="flex items-center space-x-4 ml-6 mr-9">
          {["heart-1.svg", "bags.svg", "profile.svg"].map((icon, i) => (
            <div
              key={i}
              className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-200 group"
            >
              <img
                src={`./icon/${icon}`}
                className="w-6 h-6 transition duration-200 filter group-hover:invert group-hover:brightness-200"
              />
            </div>
          ))}
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="flex items-center px-6 py-2 bg-neutral-900 text-white space-x-6">
        {/* WRAPPER */}
        <div className="relative group inline-block w-48">
          {/* BUTTON */}
          <a className="flex items-center px-3 py-2 bg-gray-700 rounded-[25px] group-hover:rounded-b-none cursor-pointer w-full">
            <img src="./icon/category.svg" className="w-5 h-5 mr-2" />
            Sve Kategorije
            <img
              src="./icon/down.svg"
              className="w-4 h-4 ml-2 transition duration-300 group-hover:rotate-180"
            />
          </a>

          {/* DROPDOWN */}
          <div className="absolute hidden group-hover:block bg-gray-700 rounded-b-[25px] z-10 p-3 w-full cursor-pointer">
            <div className="text-white">
              <span className="font-semibold">Muškarci</span>
              <div className="flex flex-col">
                <a className="flex items-center hover:bg-gray-600 px-2 py-1 rounded">
                  <img src="./icon/tshmen.svg" className="w-5 h-5 mr-2" />
                  Odeća
                </a>
                <a className="flex items-center hover:bg-gray-600 px-2 py-1 rounded">
                  <img src="./icon/menshoes.svg" className="w-5 h-5 mr-2" />
                  Obuća
                </a>
              </div>
            </div>

            <div className="text-white mt-2">
              <span className="font-semibold">Žene</span>
              <div className="flex flex-col">
                <a className="flex items-center hover:bg-gray-600 px-2 py-1 rounded">
                  <img src="./icon/tshwomen.svg" className="w-5 h-5 mr-2" />
                  Odeća
                </a>
                <a className="flex items-center hover:bg-gray-600 px-2 py-1 rounded">
                  <img src="./icon/womenshoes.svg" className="w-5 h-5 mr-2" />
                  Obuća
                </a>
              </div>
            </div>

            <div className="text-white mt-2">
              <span className="font-semibold">Deca</span>
              <div className="flex flex-col">
                <a className="flex items-center hover:bg-gray-600 px-2 py-1 rounded">
                  <img src="./icon/tshkids.svg" className="w-5 h-5 mr-2" />
                  Odeća
                </a>
                <a className="flex items-center hover:bg-gray-600 px-2 py-1 rounded">
                  <img src="./icon/childrenshoes.svg" className="w-5 h-5 mr-2" />
                  Obuća
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* LINKS */}
        {["Muškarci", "Žene", "Deca", "Aksesoari"].map((item, i) => (
          <a
            key={i}
            className="rounded-full hover:bg-gray-700 px-3 py-2 transition cursor-pointer"
          >
            {item}
          </a>
        ))}
      </nav>
    </>
  );
}