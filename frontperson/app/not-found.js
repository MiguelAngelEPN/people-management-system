import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#1b1029] text-[#FFFFFF] text-center space-y-8">
            <div className="animate-bounce">
                <h1 className="text-6xl font-bold text-[#A54895] mb-4">404</h1>
                <p className="text-xl text-[#574595]">La página que intentas acceder no existe.</p>
            </div>
            <Link href="./">
                <button className="bg-[#70919c] text-[#FFFFFF] py-3 px-8 rounded-full text-lg font-medium hover:bg-[#70839C] transition-colors duration-300 transform hover:scale-105">
                    Regresar al inicio de sesión
                </button>
            </Link>
        </div>
    );
}
