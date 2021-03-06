import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  Container
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Redirect } from "react-router-dom";

import { apiUrl } from "../url";
import { setPassword, setIsLoggedIn, setEmail } from "../redux/actions/actions.js";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const LogIn = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["token"]);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmission = async e => {
    e.preventDefault();

    if (userEmail !== "" && userPassword !== "") {
      await fetch(apiUrl + "/auth/authenticate", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: Buffer.from(
            userEmail.toLowerCase() + ":" + userPassword
          ).toString("base64")
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("error " + res.status);
          }
          return res.json();
        })
        .then(data => {
          if (data.status === "ERROR") {
            throw new Error(data.response);
          }
          setCookie("token", data.params.token);
          dispatch(setIsLoggedIn(true));
          alert("Log-in successful.");
        })
        .catch(alert);
    }
    dispatch(setEmail(userEmail));
    dispatch(setPassword(userPassword));
  };

  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log-in
        </Typography>
        <form className={classes.form} onSubmit={e => handleSubmission(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userPassword}
                onChange={e => setUserPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                id="login"
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12} justify="center">
              <Link to="/SignUp" href="/SignUp" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {isLoggedIn && <Redirect to="./Notes" />}
    </Container>
  );
};

export default LogIn;
