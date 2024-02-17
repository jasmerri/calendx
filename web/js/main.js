class CenteredList {
    constructor(centerItem) {
      this.items = [centerItem];
      this.centerIndex = 0;
    }
  
    // Insert element at the front
    insertFuture(item) {
      this.items.splice(this.items.length, 0, item);
      console.log("List after inserting " + item + ": ");
      this.display();
    }
  
    // Insert element at the back
    insertPast(item) {
      this.items.splice(0, 0, item);
      this.centerIndex++;
      console.log("List after inserting " + item + ": ");
      this.display();
    }
  
    // Get element at index
    get(index) {
      return this.items[this.centerIndex + index];
    }
  
    // Display the list
    display() {
      console.log("Items: " + this.items);
    }
  }
  
  // Example usage:
  const myList = new CenteredList(0);
  myList.insertPast(-1);
  myList.insertFuture(1);
  myList.display(); // Output: [-2, -1, 0, 1, 2]\
  console.log("Center element: " + myList.get(0));
  console.log("Center element: " + myList.get(-1));
  