import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

const styleGrid = {
  width: "100vw",
  minHeight: "100vh",
  maxWidth: "100%",
  padding: "0px 10px",
};

class Layout extends Component {
  state = {};
  render() {
    const { firstGridItem, children } = this.props;
    return (
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        style={styleGrid}
      >
        {firstGridItem ? (
          <Grid item sm={2} xs={12} style={{ border: "1px solid white" }}>
            <div>
              <p>SVG icon</p>
              <p>Clickable avatar</p>
            </div>
          </Grid>
        ) : null}
        <Grid item sm={10} xs={12} style={{ border: "1px solid white" }}>
          {children}
        </Grid>
      </Grid>
    );
  }
}

export default Layout;
