import Link from 'next/link';

export default function Home() {
	return (
		<div className='flex flex-col min-h-screen'>
			<header className='bg-gray-800 text-white p-4'>
				<nav className='container mx-auto flex justify-between'>
					<Link href='/'>Inicio</Link>
					<div className='container mx-1 flex justify-evenly'>
						<Link href='/product'>Productos</Link>
						<Link href='/order'>Órden</Link>
						<Link href='/report'>Reporte</Link>
					</div>
				</nav>
			</header>
			<main className='flex-grow container mx-auto p-4 flex items-center justify-center'>
				<h1 className='text-center text-5xl'>Restaurante el Redondel</h1>
			</main>
			<footer className='bg-gray-800 text-white p-4 text-center'>
				©2025 - Hogar para Adultos Mayores Corazón de Jesús de Puriscal
			</footer>
		</div>
	);
}
