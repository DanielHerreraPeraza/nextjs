import Link from 'next/link';
import '../app/globals.css';

export default function Layout({ children }) {
	return (
		<div className='flex flex-col min-h-screen'>
			<header className='bg-gray-800 text-white p-4'>
				<nav className='container mx-auto flex justify-between'>
					<Link href='/'>Inicio</Link>
					<div className='container mx-1 flex justify-evenly'>
						<Link href='/product'>Productos</Link>
						<Link href='/order'>Orden</Link>
						<Link href='/report'>Reporte</Link>
					</div>
				</nav>
			</header>
			<main className='flex-grow container mx-auto p-4'>{children}</main>
			<footer className='bg-gray-800 text-white p-4 text-center'>
				©2025 - Hogar para Adultos Mayores Corazón de Jesús de Puriscal
			</footer>
		</div>
	);
}
