const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api-3', {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
});

