describe("Test the get started sample", () => {
  it("can send a message", () => {
    cy.viewport("macbook-15");
    // Login
    cy.visit("http://localhost:9000/sdk_quickstart");
    cy.wait(1000); // wait 1s
    cy.get(".button").contains("Login").click();
    cy.wait(1000);
    cy.contains("LOGIN_SUCCESS");

    // Subscribe to a channel
    cy.get(".button").contains("Join").click();
    cy.wait(1000);
    cy.contains("joined"); // Joine the channel
    cy.contains("is in the channel"); // presence works

    // type a message and hit send
    cy.get('[id="channelMessage"]').type("Hello World!");
    cy.get(".button").contains("Send").click();
    cy.wait(1000);

    // Assert message sent
    cy.get("[id=log]").contains("Hello World!");

    // Unsubscribe channel
    cy.get(".button").contains("Leave").click();
    cy.wait(1000);
    cy.get("[id=log]").contains("successfully left channel");

    // Logout
    cy.get('.button').contains('Logout').click();
    cy.wait(3000);
    cy.get("[id=log]").contains("DISCONNECTED");
    cy.get("[id=log]").contains("LOGOUT");
  });
});

