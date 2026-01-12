# GraphQL Invitation API Example Inputs

> This document contains example GraphQL queries and mutations for the Invitation API, based on the current resolver and input definitions.
> Use these examples to test or integrate with the API.

---

## 1. Create an Invitation

```graphql
mutation {
  createInvitation(input: { recipient: "Famiglia Ranieri Frontino" }) {
    _id
    recipient
  }
}
```

---

## 2. Update an Invitation

```graphql
mutation {
  updateInvitation(
    id: "68a739fdf64dd848ca61856d"
    input: {
      recipient: "Famiglia Ranieri Frontino"
      confirmationStatus: CONFIRMED
      email: "jgiak92@gmail.com"
      phoneNumber: "+393331942172"
      isInterestedInAccommodation: true
    }
  ) {
    _id
    recipient
    confirmationStatus
    email
    phoneNumber
    isInterestedInAccommodation
  }
}
```

---

## 3. Update Invitation Participants

```graphql
mutation {
  updateInvitationParticipants(
    id: "68a739fdf64dd848ca61856d"
    input: {
      participants: [
        {
          name: "Giacomo"
          lastName: "Ranieri"
          age: ADULT
          intolerances: ""
          celiac: false
          vegetarian: false
          vegan: false
        }
        {
          name: "Loredana"
          lastName: "Frontino"
          age: ADULT
          intolerances: ""
          celiac: false
          vegetarian: false
          vegan: false
        }
      ]
    }
  ) {
    _id
    recipient
    participants {
      name
      lastName
      age
      intolerances
      celiac
      vegetarian
      vegan
    }
  }
}
```

---

## 4. Get an Invitation by ID

```graphql
query {
  invitation(id: "68a739fdf64dd848ca61856d") {
    _id
    recipient
    confirmationStatus
    participants {
      name
      lastName
      age
    }
  }
}
```

---

## 5. Get all Invitations

```graphql
query {
  invitations {
    _id
    recipient
    confirmationStatus
    participants {
      name
      lastName
      age
    }
  }
}
```
