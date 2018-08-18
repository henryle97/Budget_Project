var budgetController = (function(){

    var x = 23;

    // Declare one method
    var add = function(a) {
        return x + a;
    }

    // Return an Object - have a method publicTest
    return {
        publicTest: function(b) {
            return add(b);
        } 
    };

})();

var UIController = (function(){

    //Some code

})(); 

var controller = (function(budgetCtr, UICtr) {

    var z = budgetCtr.publicTest(10);
    
    return {
        anotherPublish: function() {
            console.log(z);
        }
    }

})(budgetController, UIController);