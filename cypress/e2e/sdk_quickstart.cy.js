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
    cy.get(".button").contains("Subscribe").click();
    cy.wait(1000);
    cy.contains("joined"); // Joined the channel
    cy.get("[id=users-list]").contains("1"); // presence works

    // type a message and hit send
    cy.get('[id="channelMessage"]').type("Hello World!");
    cy.get(".button").contains("Send").click();
    cy.wait(1000);

    // Assert message sent
    cy.get("[id=log]").contains("Hello World!");

    // Unsubscribe channel
    cy.get(".button").contains("Unsubscribe").click();
    cy.wait(1000);
    cy.get("[id=log]").contains("successfully left channel");

    // Logout
    cy.get('.button').contains('Logout').click();
    cy.wait(3000);
    cy.get("[id=log]").contains("DISCONNECTED");
    cy.get("[id=log]").contains("LOGOUT");
  });
});

