
import './globals.css';
import './assets/css/tailwind.css';
import Navbar from './components/Navbar';


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
