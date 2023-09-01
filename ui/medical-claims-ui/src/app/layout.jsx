
import './assets/css/tailwind.css';
import './globals.scss';
import Navbar from './components/navbar';


export const metadata = {
	title: 'Azure Cosmos DB Medical Claims Demo App',
	description: '',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" data-layout-mode="light">
			<body>
				<Navbar>
					{ children }
				</Navbar>
			</body>
		</html>
	);
}
