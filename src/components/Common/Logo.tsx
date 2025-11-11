import logo from './../../assets/images/settisfy-icon.png'

const Logo = () => {
	return (
		<>
			<div className="barnd-logo">
				<div className="logo-icon" style={{ width: '60px', height: '60px' }}>
					<img src={logo} alt="logo-icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
				</div>
				<div className="logo-text" style={{ fontSize: '25px' }}>Settisfy</div>
			</div>
		</>
	)
}

export default Logo
