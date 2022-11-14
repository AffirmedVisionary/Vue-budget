module.exports = mongoose => {

    var schema = mongoose.Schema(
        {
            name: String,
            purpose: String,
            firstDate: Date,
            expected: Number,
            frequency: String,
            payments: [{
                dueDate: Date,
                paid: Boolean
            }],
            upToDate: Boolean
        },
        { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Expense = mongoose.model("expense", schema);
    return Expense;
  };
