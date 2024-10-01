import classes from './Button.module.css'

const Button = ({ type, label, disabled }) => {
    return (
      <button type={type} disabled={disabled} className={classes.submitbutton}>
        {label}
      </button>
    );
};

export default Button;