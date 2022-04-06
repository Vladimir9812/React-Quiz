import React, { Component } from "react";
import classes from "./Drawer.module.css";
import Backdrop from "../../UI/Backdrop/Backdrop";
import {NavLink} from "react-router-dom";

class Drawer extends Component {
	clickHandler = () => {
		this.props.onClose();
	}

	renderLinks(links) {
		return links.map((link, index) => {
			return (
				<li key={index}>
					<NavLink
						to={link.to}
						exact={link.exact}
						className={(navigationData) => navigationData.isActive ? classes.active : null }
						onClick={this.clickHandler}
					>
						{link.label}
					</NavLink>
				</li>
			)
		})
	}

	render() {
		const cls = [classes.Drawer];

		if (!this.props.isOpen) {
			cls.push(classes.close);
		}

		const links = this.props.isAuthencated
			? [
					{ to: "/", label: "Список", exact: "true" },
					{ to: "/quiz-creator", label: "Создать тест", exact: "false" },
					{ to: "/logout", label: "Выйти", exact: "false" }
				]
			: [
					{ to: "/auth", label: "Авторизация", exact: "false" },
					{ to: "/", label: "Список", exact: "true" }
				];

		return (
			<React.Fragment>
				<nav className={cls.join(" ")}>
					<ul>
						{this.renderLinks(links)}
					</ul>
				</nav>

				{ this.props.isOpen ? <Backdrop onClick={this.props.onClose}/> : null}
			</React.Fragment>
		)
	}
}

export default Drawer;