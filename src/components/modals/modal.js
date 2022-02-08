import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Close } from "@material-ui/icons";


export default function ModalButton(props) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = (event) => {
		event.preventDefault();
		setOpen(true);
		console.clear();
	};

	const handleClose = () => {
		setOpen(false);
		const {cancelClick} = props;
		if (cancelClick){
			cancelClick();
		}
	};

	const {onClick, label, title, text, input, button, div, enter, cancel, c, className, cl, id, db, w} = props;

	return (
		<div className={ w ? w : '' }>
			{ div ?
				<div onClick={ db ? null : handleClickOpen }
				     onDoubleClick={ db ? handleClickOpen : null }
				     className={ className }
				     onFocus={ (event) => event.stopPropagation() }
				     title={ title ? title : '' }>{ div }</div> :
				<Button onClick={ handleClickOpen } className={ className } variant="contained"
				        onFocus={ (event) => event.stopPropagation() }
				        title={ title ? title : '' }>{ button }</Button>
			}
			<Dialog
				open={ open }
				onClose={ handleClose }
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={ `modal ${ cl }` }
				id={ id ? id : void 0 }
			>
				<Button
					onClick={ handleClose }
					style={ {
						position: "absolute",
						right: '20px',
						top: '20px',
					} }
				><Close/></Button>
				<DialogTitle id="alert-dialog-title">{ label }</DialogTitle>
				{ text ? <DialogContent>
						<DialogContentText id="alert-dialog-description">
							{ text }
						</DialogContentText>
					</DialogContent> :
					<div className="modal__input">{ input }</div>
				}
				<br/>
				{ enter ? <DialogActions>
					{ cancel ? <Button
						style={ {
							width: cancel ? '230px' : '250px',
							color: 'white',
							textTransform: 'none',
							background: '#212121',
							borderRadius: '12px',
						} }
						size='large'
						onClick={ (event) => {
							event.preventDefault();
							handleClose();
						} } variant="contained" autoFocus>
						{ cancel }
					</Button> : null }
					<Button
						style={ {
							width: cancel ? '230px' : '250px',
							color: 'white',
							textTransform: 'none',
							background: '#212121',
							borderRadius: '12px',
						} }
						size='large'
						onClick={ (event) => {
							event.preventDefault();
							onClick();
							if (!c){
								handleClose();
							}
						} } variant="contained" autoFocus>
						{ enter }
					</Button>
				</DialogActions> : null }
				<br/>
			</Dialog>
		</div>
	);
}
