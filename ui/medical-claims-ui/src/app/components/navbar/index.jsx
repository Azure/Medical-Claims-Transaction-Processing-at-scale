'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './navbar.scss';

import { FaHouse, FaUserGroup, FaBriefcaseMedical } from 'react-icons/fa6';
import { MdMenu, MdMonetizationOn, MdSpeakerNotes } from 'react-icons/md';

const menuItems = [
	{
		href: '/',
		title: '',
		icon: FaHouse
	},
	{
		href: '/members',
		title: 'Members',
		icon: FaUserGroup
	},
	{
		href: '/providers',
		title: 'Providers',
		icon: FaBriefcaseMedical
	},
	{
		href: '/payers',
		title: 'Payers',
		icon: MdMonetizationOn
	},
	{
		href: '/adjudicator/claims',
		title: 'Adjudicators',
		icon: MdSpeakerNotes
	},
];

export default function NavBar({ children }) {
	const [collapsed, setCollapsed] = useState(false);
	const [title, setTitle] = useState('');
	const pathname = usePathname()

	return (
		<div className="main">

			{/* Header */}
			<header className="header">
				<button onClick={ () => setCollapsed(!collapsed) } className="header__button">
					<MdMenu className="navbar__icon" />
				</button>

				<h1 className="header__text">@ Medical Claims { title && <>/ { title }</> }</h1>
			</header>

			{/* Inner wrapper */}
			<div className="inner">

				{/* Navbar */}
				<nav className="navbar">
					{menuItems.map(({ href, title, icon }) => (
						<Link href={ href } key={ title } className={ `navbar__item ${pathname === href ? 'active' : '' }`}>
							<button className="navbar__button" onClick={ () => setTitle(title) }>
								{ React.createElement(icon, { className: 'navbar__icon' }) }
							</button>
						</Link>
					))}
				</nav>

				{/* Main content */}
				<main className="content">
					{ children }
				</main>
			</div>

		</div>
	);
}