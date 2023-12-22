const mongoose = require("mongoose");
const express = require('express');
const app = express();
//const port = 3000;

let Schema = {
  sports: new mongoose.Schema({
    id:{
      type: Number,
      default:null
     },
    sport_name: {
      type: String,
      required: false,
      default: null,
    },
    status:{
      type:Number,
      required:false,
      default:null,
    }
    
   
}),

superadminlogins:new mongoose.Schema({
id:{
  type:Number,
  required:false,
  default:null,
},
username:{
  type:String,
  required:false,
  default:null,
},
password:{
      type:String,
      required:false,
      default:null,
},
firstName:{
      type:String,
      required:false,
      default:null,

},
lastName:{
  type:String,
  required:false,
  default:null,
},
role:{
  type:Number,
  required:false,
  default:null,
},
token:{
  type:String,
  required:false,
  default:null,
}

}),

designations: new mongoose.Schema({
  id:{
    type: Number,
    default:null
   },
  name: {
    type: String,
    required: false,
    default: null,
  },
  status:{
    type:Number,
    required:false,
    default:null,
  }
  
 
}),

Mainaccounts:new mongoose.Schema({
   id:{
    type: Number,
    default:null
   },
  academy_name:{
    type:String,
    required:false,
    default:null,
  },
  role_id:{
    type:Number,
    required:false,
    default:null,
  },
  fullName:{
    type:String,
    required:false,
    default:null,
  },
  academy_no:{
    type:Number,
    required:false,
    default:null,
  },
  email:{
    type:String,
    required:false,
    default:null,
  },
  academyemail:{
    type:String,
    required:false,
    default:null,
  },
  mobileno:{
    type:String,
    required:false,
    default:null,
  },
  logo:{
    type:String,
    required:false,
    default:null,
  },
  website:{
    type:String,
    required:false,
    default:null,
  },
  centre_name:{
    type:String,
    required:false,
    default:null,
  },
  location:{
    type:String,
    required:false,
    default:null,
  },
  is_coach:{
    type:Number,
    required:false,
    default:null,
  },
  
  person_incharge:{
    type:String,
    required:false,
    default:null,
  },
  designation:{
    type:String,
    required:false,
    default:null,
  },
  identificationid:{
    type:String,
    required:false,
    default:null,
  },
 
  address:{
    type:String,
    required:false,
    default:null,
  },
  
  sports:{
    type:String,
    required:false,
    default:0,
  },
  password:{
    type:String,
    require:false,
    default:null
  },
  username:{

    type:String,
    require:false,
    default:null

  },
  subscriberID:{
    type:Number,
    required:false,
    default:null,
  },
  status:{
    type:Number,
    required:false,
    default:null,
  },
  created_at:{
    type:String,
    required:false,
    default:null,
  },
  updated_at:{
    type:String,
    required:false,
    default:null,
  },

   
}),

class:new mongoose.Schema({
id:{
type:Number,
default:null,
required:false
},
name:{
  type:String,
  default:null,
  required:false
},
Branch_id:{
  type:Number,
  default:null,
  required:false
},
batch_id:{
  type:Number,
  default:null,
  required:false
},
calss_key:{
  type:Number,
  default:null,
  required:false
},
add_by:{
  type:Number,
  required:false,
  default:null,
},
status:{
  type:Number,
  required:false,
  default:null,
},
created_at:{
  type:String,
  required:false,
  default:null,
},
}),

Level:new mongoose.Schema({
id:{ 
  type:Number,
  required:false,
  default:null,
},
level_name:{
  type:String,
  required:false,
  default:null,
}
}),

HeaderCollection:new mongoose.Schema({
  id:{ 
    type:Number,
    required:false,
    default:null,
  },
  name:{
    type:String,
    required:false,
    default:null,
  },
}),

Inputmaster:new mongoose.Schema({
  id:{ 
    type:Number,
    required:false,
    default:null,
  },
  name:{
    type:String,
    required:false,
    default:null,
  },
  add_by:{
    type:Number,
    required:false,
    default:null,
  },
  status:{
    type:Number,
    required:false,
    default:1
  }
  }),

  
  userinfos: new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    default: null,
  },
  user_id: {
    type: Number,
    required: false,
    default: null,
  },
  form_id: {
    type: Number,
    required: false,
    default: null,
  },
  input_type: {
    type: Number,
    required: false,
    default: null,
  },
  is_required: {
    type: String,
    required: false,
    default: null,
  },
  label_name: {
    type: String,
    required: false,
    default: null,
  },
  delete_status:{
    type: Number,
    required: false,
    default: null,
  },
  status: {
    type: String,
    required: false,
    default: null,
  },
  name: {
    type: String,
    required: false,
    default: null,
  },
  optionList: [
    {
      id:Number,
      value: String,
    },
  ],
}),

Menu: new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    default: null,
  },
  profile_id: {
    type: Number,
    required: false,
    default: null,
  },
  class: {
    type: String,
    required: false,
    default: null,
  },
  path: {
    type: String,
    required: false,
    default: null,
  },
  title: {
    type: String,
    required: false,
    default: null,
  },
  iconType: {
    type: String,
    required: false,
    default: null,
  },
  icon: {
    type: String,
    required: false,
    default: null,
  },
  role: {
    type: String,
    required: false,
    default: null,
  },
  submenu: [
    {
      submenupath: String,
      submenutitle: String,
      submenuclass: String,
      submenuiconType: String,
      submenuicon: String,
      
    },
  ],
}),

Menuold:new mongoose.Schema({
  id:{
    type:Number,
    required:false,
    default:null,
  },
  path:{
    type:String,
    required:false,
    default:null,
  },
  title:{
    type:String,
    required:false,
    default:null,
  },
  iconType:{
    type:String,
    required:false,
    default:null,
  },
  icon:{
    type:String,
    required:false,
    default:null,
  },
  role:{
    type:String,
    required:false,
    default:null,
  },
  submenupath:{
    type:String,
    required:false,
    default:null,
  },
  submenutitle:{
    type:String,
    required:false,
    default:null,
  },
  submenuiconType:{
    type:String,
    required:false,
    default:null,
  },
  submenuicon:{
    type:String,
    required:false,
    default:null,
  },
  submenurole:{
    type:String,
    required:false,
    default:null,
  }

}),

formfields: new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    default: null,
  },
  
  user_id: {
    type: String,
    required: false,
    default: null,
  },
  form_id: {
    type: Number,
    required: false,
    default: null,
  },
  user_name: {
    type: String,
    required: false,
    default: null,
  },
 
  fields: [
    {
      //(userinfo id.........................)
      ids: Number,
      value: String,
     },
  ],
}),

leveldata:new mongoose.Schema({
  id:{ 
    type:Number,
    required:false,
    default:null,
  },
  role_id:{
    type:Number,
    required:false,
    default:null,
  },
  academy_id:{
    type:Number,
    required:false,
    default:null,
  },
  academy_name:{
    type:String,
    required:false,
    default:null,
  },
  centre_name:{
    type:String,
    required:false,
    default:null,
  },
  location:{
    type:String,
    required:false,
    default:null,
  },
  sports:{
    type:String,
    required:false,
    default:null,
  },
  person_incharge:{
    type:String,
    required:false,
    default:null,
  },
  designation:{
    type:String,
    required:false,
    default:null,
  },
  contact_no:{
    type:Number,
    required:false,
    default:null,
  },
  is_coach:{
    type:Number,
    required:false,
    default:null,
  },
  email_id:{
    type:String,
    required:false,
    default:null,
  },
  forms: [  Number],
  // forms:{
  //   type:String,
  //   required:false,
  //   default:null,
  // },
  
  created_at:{
    type:String,
    required:false,
    default:null,
  },
  updated_at:{
    type:String,
    required:false,
    default:null,
  },
  status:{
    type:Number,
    required:false,
    default:1
  }
  }),

  players: new mongoose.Schema({
    id:{
      type: Number,
      default:null
     },
     player_name: {
      type: String,
      required: false,
      default: null,
    },
    player_last_name: {
      type: String,
      required: false,
      default: null,
    },
    dob: {
      type:String,
      required: false,
      default: null,
    },
    age: {
      type: String,
      required: false,
      default: null,
    },
    parent_name: {
      type: String,
      required: false,
      default: null,
    },
    parent_no: {
      type: String,
      required: false,
      default: null,
    },
    email_id: {
      type: String,
      required: false,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      default: null,
    },
    profile_photo: {
      type: String,
      required: false,
      default: null,
    },
    academy_id: {
      type: Number,
      required: false,
      default: null,
    },

    level_id:{
      type: Number,
      required: false,
      default: null,} ,
    batch_id: {
      type: Number,
      required: false,
      default: null,
    },
    payment_type:{
      type: String,
      required: false,
      default: null,
    },

    status:{
      type:Number,
      required:false,
      default:null,
    },
    updated_at:{
      type:String,
      required:false,
      default:null,
    },
    created_at:{
      type:String,
      required:false,
      default:null,
    },

    
   
  }),


  Curriculumdata: new mongoose.Schema({
    id:{
      type: Number,
      default:null
     },
     academy_id: {
      type: Number,
      required: false,
      default: null,
    },
    academy_name: {
      type: String,
      required: false,
      default: null,
    },
    level_id: {
      type: Number,
      required: false,
      default: null,
    },
    level_name: {
      type: String,
      required: false,
      default: null,
    },
    skill: {
      type: String,
      required: false,
      default: null,
    },
    technique: {
      type: String,
      required: false,
      default: null,
    },
    sports: {
      type: String,
      required: false,
      default: null,
    },
    drill: {
      type: String,
      required: false,
      default: null,
    },
    video_link: {
      type: String,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    status:{
      type:Number,
      required:false,
      default:null,
    },
    updated_at:{
      type:String,
      required:false,
      default:null,
    },
    created_at:{
      type:String,
      required:false,
      default:null,
    },

    
   
  }),

  Level:new mongoose.Schema({
    id:{ 
      type:Number,
      required:false,
      default:null,
    },
    level_name:{
      type:String,
      required:false,
      default:null,
    }
    }),
    
    staffdatas:new mongoose.Schema({
      id:{ 
        type:Number,
        required:false,
        default:null,
      },
      staff_name:{
        type:String,
        required:false,
        default:null,
      },
      designation:{
        type:Number,
        required:false,
        default:null,
      },
      identification_id:{
        type:String,
        required:false,
        default:null,
      },
      contact_no:{
        type:String,
        required:false,
        default:null,
      },
      email_id:{
        type:String,
        required:false,
        default:null,
      },
      dob:{
        type:String,
        required:false,
        default:null,
      },
      is_coach:{
        type:Number,
        required:false,
        default:null,
      },
      academy_name:{
        type:String,
        required:false,
        default:null,
      },
      academy_id:{
        type:Number,
        required:false,
        default:null,
      },
      created_at:{
        type:String,
        required:false,
        default:null,
      },
      updated_at:{
        type:String,
        required:false,
        default:null,
      },
      status:{
        type:Number,
        required:false,
        default:null,
      },
    }),

    Attendance: new mongoose.Schema({
      id:{
        type:Number,
        required:false,
        default:null,
      },
      player_id:{
        type:Number,
        required:false,
        default:null
      },
      academy_name:{
        type:String,
        required:false,
        default:null,
      },
      academy_id:{
        type:Number,
        required:false,
        default:null,
      },
      attendance_status:{
        type:String,
        required:false,
        default:null,
      },
      
      date:{
        type:String,
        required:false,
        default:null,
      },
      coach_id:{
        type:Number,
        required:false,
        default:null,
      },
      level_id:{
        type:Number,
        required:false,
        default:null,
      },
      level_name:{
        type:String,
        required:false,
        default:null,
      },

      batch_id:{
        type:Number,
        required:false,
        default:null,
      },
      
    
      
     
      created_at:{
        type:String,
        required:false,
        default:null,
      },
      updated_at:{
        type:String,
        required:false,
        default:null,
      },
      status:{
        type:Number,
        required:false,
        default:null,
      },
    }),

    menupermistion:new mongoose.Schema({
      id:{
        type:Number,
        required:false,
        default:null,
      },
      menu_id:[Number],
      //sub_menu_id:[Number],
      
      role_id:{
        type:Number,
        required:false,
        default:null,
      },
      academy_id:{
        type:Number,
        required:false,
        default:null,
      },
      level_id:{
        type:Number,
        required:false,
        default:null,
      },
      
      created_at:{
        type:String,
        required:false,
        default:null,
      },
    }),
     batchdata: new mongoose.Schema({
      id:{
        type:Number,
        required:false,
        default:null,
      },
      academy_name:{
        type:String,
        required:false,
        default:null,
      },
      academy_id:{
        type:Number,
        required:false,
        default:null,
      },
      batch_name:{
        type:String,
        required:false,
        default:null,
      },
      batch_timing:{
        type:String,
        required:false,
        default:null,
      },
      location:{
        type:String,
        required:false,
        default:null,
      },
      centre_name:{
        type:String,
        required:false,
        default:null,
      },
      level_id:{
        type:Number,
        required:false,
        default:null,
      },
      level_name:{
        type:String,
        required:false,
        default:null,
      },
      
      coach_id: [Number],
      days: [String],
      created_at:{
        type:String,
        required:false,
        default:null,
      },
      updated_at:{
        type:String,
        required:false,
        default:null,
      },
      status:{
        type:Number,
        required:false,
        default:null,
      },
    }),


createDynamicSchemaForUser: function(user_id, form_id, collectionName, fields) {
  const fieldTypesMap = {
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    // Add more data types here as needed
  };

  const userSchemaFields = {
    user: { type: String, required: false },
    user_id: Number,
    form_id: Number,
    fields: {}, // Initialize an empty object to store fields
    // Add more common fields here if needed
  };

  for (const field in fields) {
    const fieldType = fields[field];
    if (['String', 'Number', 'Boolean', 'Date'].includes(fieldType)) {
      userSchemaFields[field] = eval(fieldType); // Using eval is safe here since we're controlling the input.
    }
  }

  console.log('fieldName...............')
    //yconsole.log(fieldName)
  // for (const fieldName in fields) { // Change this line
  //   console.log('fieldName...............')
  //   console.log(fieldName)
  //   const dataType = fieldTypesMap[fields.fields[fieldName]] || String; // Change this line
  //   userSchemaFields.fields[fieldName] = dataType; // Set the field name with its corresponding data type
  // }
  console.log('userSchemaFields...............')
  console.log(userSchemaFields)
  const userSchema = new mongoose.Schema(userSchemaFields, { collection: collectionName });

  // Check if the model already exists, and only recreate if it doesn't
  const modelName = `User_${user_id}`;
  if (mongoose.models[modelName]) {
    return mongoose.model(modelName);
  }

  return mongoose.model(modelName, userSchema);
},




 createDynamicSchemaForlevel:function(id,user_id,form_id, fields) {
  const userSchemaFields = {
    id:Number,
    user_id: Number,
    form_id: Number,
    // Add more common fields here if needed
  };

  // Process the fields object to add custom fields to the userSchemaFields
  for (const field in fields) {
    const fieldType = fields[field];
    if (['String', 'Number', 'Boolean', 'Date'].includes(fieldType)) {
      userSchemaFields[field] = eval(fieldType); // Using eval is safe here since we're controlling the input.
    }
  }

  const userSchema = new mongoose.Schema(userSchemaFields, { collection: id });
  return mongoose.model(`form_${user_id}`, userSchema);
}


}





function createDynamicSchemaForUser(user_id,form_id, collectionName, level_name) {
  const fieldTypesMap = {
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    // Add more data types here as needed
  };

  // const userSchemaFields = {
  //   username: String,
  //   // Add more common fields here if needed
  //   ...Object.entries(level_name).reduce((acc, [key, value]) => {
  //     const dataType = fieldTypesMap[value] || String;

  //     console.log('dataType...................');
  //     console.log(dataType);
  //     acc[key] = { type: dataType };
  //     return acc;
  //   }, {}),
  // };
  const userSchemaFields = {
    username: { type: String, required: true },
    level_name: [{ type: String }], // Set the type to an array of objects
    // Add more common fields here if needed
  };

  level_name.forEach((item) => {
    const { level_name: fieldName } = item;
    const dataType = fieldTypesMap[fieldName] || String;
    userSchemaFields.level_name.push({ [fieldName]: dataType }); // Push the object with field name and type
  });
  

  const userSchema = new mongoose.Schema(userSchemaFields, { collection: collectionName });

  // Check if the model already exists, and only recreate if it doesn't
  const modelName = `User_${username}`;
  if (mongoose.models[modelName]) {
    return mongoose.model(modelName);
  }

  return mongoose.model(modelName, userSchema);
}

app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { username, collectionName, fields } = req.body;

    // Create a dynamic schema and model for the user based on the input
    const User = createDynamicSchemaForUser(username, collectionName, fields);

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // User exists, you can return the existing user data if needed
      res.json(existingUser);
    } else {
      // User does not exist, create a new user document and save it to the database
      const newUser = new User({ username, ...fields });
      await newUser.save();

      res.status(201).json(newUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



//module.exports = Schema;

module.exports = { createDynamicSchemaForUser,Schema };