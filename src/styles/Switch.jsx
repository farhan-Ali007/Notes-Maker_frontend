const Switch = ({ checked, onChange }) => {
  return (
    <label className="ui-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="slider">
        <div className="circle"></div>
      </div>
    </label>
  );
};

export default Switch;
