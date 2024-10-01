import classes from './Input.module.css'

const InputField = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  reference,
}) => {
  return (
    <div className={classes['input-field']}>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        ref={reference}
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
      />
      <br />
    </div>
  );
};

export default InputField;
