import Layout from '../layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Product() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch('/api/products');
			const data = await res.json();
			setProducts(data);
			setFilteredProducts(data);
		};

		fetchProducts();
	}, []);

	const handleEditClick = (product) => {
		router.push(
			`/product/update?id=${product._id}&name=${product.name}&price=${product.price}&category=${product.category}&status=${product.status}`
		);
	};

	const handleCreateClick = () => {
		router.push('/product/create');
	};

	const handleDeleteClick = async () => {
		const res = await fetch(`/api/products`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: selectedProductId }),
		});

		if (res.ok) {
			setProducts((prevProducts) =>
				prevProducts.filter((product) => product._id !== selectedProductId)
			);
			setFilteredProducts((prevProducts) =>
				prevProducts.filter((product) => product._id !== selectedProductId)
			);
		} else {
			console.log('Error al eliminar el producto.');
		}
		setOpenDialog(false);
	};

	const handleOpenDialog = (productId) => {
		setSelectedProductId(productId);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedProductId(null);
	};

	const handleSearchChange = (e) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);
		setFilteredProducts(
			products.filter(
				(product) =>
					product.name.toLowerCase().includes(query) ||
					product.category.toLowerCase().includes(query)
			)
		);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Layout>
			<div className='container mx-auto p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-2xl font-bold'>Productos</h1>
					<button
						className='bg-blue-500 text-white px-4 py-2 rounded'
						onClick={handleCreateClick}
					>
						Crear Producto
					</button>
				</div>
				<div className='mb-4'>
					<TextField
						label='Buscar'
						variant='outlined'
						fullWidth
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Precio</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Categoría</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Estado</TableCell>
								<TableCell align='center' style={{ fontWeight: 'bold' }}>
									Acciones
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredProducts
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((product) => (
									<TableRow
										key={product._id}
										hover
										style={{
											backgroundColor:
												product.status === 'disabled' ? '#f0f0f0' : 'inherit',
										}}
									>
										<TableCell
											style={{
												color:
													product.status === 'disabled' ? '#a0a0a0' : 'inherit',
											}}
										>
											{product.name}
										</TableCell>
										<TableCell
											style={{
												color:
													product.status === 'disabled' ? '#a0a0a0' : 'inherit',
											}}
										>
											{product.price}
										</TableCell>
										<TableCell
											style={{
												color:
													product.status === 'disabled' ? '#a0a0a0' : 'inherit',
											}}
										>
											{product.category}
										</TableCell>
										<TableCell
											style={{
												color:
													product.status === 'disabled' ? '#a0a0a0' : 'inherit',
											}}
										>
											{product.status === 'enabled'
												? 'Habilitado'
												: 'Deshabilitado'}
										</TableCell>
										<TableCell align='center'>
											<EditIcon
												onClick={() => handleEditClick(product)}
												className={
													'text-blue-500 hover:text-blue-700 cursor-pointer'
												}
											/>
											<DeleteIcon
												onClick={() => handleOpenDialog(product._id)}
												className={
													'text-red-500 hover:text-red-700 cursor-pointer'
												}
											/>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={filteredProducts.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>

				{/* Material-UI Confirmation Dialog */}
				<Dialog
					open={openDialog}
					onClose={handleCloseDialog}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>
						Confirmar Eliminación
					</DialogTitle>
					<DialogContent>
						<DialogContentText id='alert-dialog-description'>
							¿Está seguro de que desea eliminar este producto? Esta acción no
							se puede deshacer.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog} color='primary'>
							Cancelar
						</Button>
						<Button onClick={handleDeleteClick} color='error' autoFocus>
							Eliminar
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</Layout>
	);
}
