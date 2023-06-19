import "../app.scss";
import { useImmer } from "use-immer";
import * as EmailValidator from "email-validator";
import { passwordStrength } from "check-password-strength";
import intitialState from "../common/intitialState.js";

function Validator() {
  const [state, setState] = useImmer(intitialState);

  const validate =
    state.email &&
    !state.showInvalidEmail &&
    state.password.length > 8 &&
    ["Strong", "Medium"].includes(state.passwordStrength.value) &&
    state.password === state.confirmPassword;

  return (
    <div id="app">
      <form id="my-form" className="shadow">
        <h4>Form Validator</h4>

        <div className="mb-4">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            data-rules="required|digits:5|min:5"
            placeholder="Enter your email"
            value={state?.email || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.email = event.target.value;
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.showInvalidEmail = !EmailValidator.validate(state?.email);
              });
            }}
          />
          {state.showInvalidEmail && (
            <div className="validator-err">Invalid Email</div>
          )}
        </div>
        <div className="mb-4" style={{ position: "relative" }}>
          <label>Password</label>
          <input
            className="form-control"
            type={state.showPassword ? "text" : "password"}
            data-rules="required|string|min:5"
            value={state.password || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.password = event.target.value;
                if (state.showPassword) {
                  draft.confirmPassword = event.target.value;
                }
                if (event.target.value.length > 8) {
                  const passwordStrengthValue = passwordStrength(
                    event.target.value
                  ).value;
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch (passwordStrengthValue) {
                    case "Too weak":
                      draft.passwordStrength.color = "red";
                      break;
                    case "Weak":
                      draft.passwordStrength.color = "orange";
                      break;
                    case "Medium":
                      draft.passwordStrength.color = "yellow";
                      break;
                    default:
                      draft.passwordStrength.color = "green";
                  }
                  draft.isPasswordShort = true;
                } else {
                  draft.passwordStrength.value = "";
                  draft.passwordStrength.color = "";
                }
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.isPasswordShort = state.password.length < 8;
              });
            }}
          />
          {state.isPasswordShort && (
            <div className="validator-err">Password is too short</div>
          )}

          {state.password && (
            <button
              style={{
                position: "absolute",
                top: 25,
                right: 10,
                width: 50,
                padding: "0 !important",
                margin: 0,
                fontSize: 20,
                border: "none",
                backgroundColor: "transparent ",
                color: "black",
              }}
              type="button"
              onClick={() => {
                setState((draft) => {
                  draft.showPassword = !draft.showPassword;
                  if (!state.showPassword) {
                    draft.confirmPassword = state.password;
                    draft.passwordMatch = true;
                  } else {
                    draft.confirmPassword = "";
                    draft.passwordMatch = false;
                  }
                });
              }}
            >
              {state.showPassword ? (
                "Hide"
              ) : (
                <i class="fa-solid fa-eye" id="eye"></i>
              )}
            </button>
          )}
        </div>
        {!state.showPassword && (
          <div className="mb-4">
            <label>Password Confirm</label>
            <input
              className="form-control"
              type="password"
              data-rules="required|string|min:5"
              value={state.confirmPassword || ""}
              onChange={(event) => {
                setState((draft) => {
                  draft.confirmPassword = event.target.value;
                  draft.passwordMatch = event.target.value === state.password;
                });
              }}
            />
          </div>
        )}
        {!state.passwordMatch && state.confirmPassword && (
          <div className="validator-err">
            Confirm password is not match with password
          </div>
        )}
        {state.passwordStrength.value && (
          <div
            className="mb-4"
            style={{
              position: "relative",
              color: state.passwordStrength.color,
            }}
          >
            {state.passwordStrength.value}{" "}
          </div>
        )}
        <ul className="information">
          <li> password must be at least 8 character </li>
          <li> password must contain at least one number </li>
          <li> password must contain at least one uppercase letter </li>
          <li> password must contain at least one symbol </li>
        </ul>

        <button
          disabled={!validate}
          style={{
            backgroundColor: validate ? "" : "gray",
          }}
          onClick={() => {
            alert("Congratulation! You have successfully registered");
            setState(intitialState);
          }}
          type="button"
        >
          register
        </button>
      </form>
    </div>
  );
}

export default Validator;
