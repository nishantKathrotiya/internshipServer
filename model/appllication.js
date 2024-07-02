const mongoose = require("mongoose");


const CommitteeSchema = new mongoose.Schema({
  status: {
    type: String,
    default: '',
    enum: ["pending", "inprogress", "approved", "rejected", "returned","closed"]
  },
  msg: {
    type: String,
    default: ''
  }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  mname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
  },
  studentDBID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
    enum: ["CE", "CS", "IT"],
  },
  pgUg: {
    type: String,
    required: true,
    enum: ["PG", "UG"],
  },
  institute: {
    type: String,
    required: true,
    enum: ["DEPSTAR", "CSPIT"],
    default: "DEPSTAR",
  },
  attendance: {
    type: Number,
    required: true,
  },
  coAuthors: [
    {
      studentName: {
        type: String,
      },
      studentID: {
        type: String,
      },
      studentDepartment: {
        type: String,
        enum: ["CE", "CS", "IT"],
      },
      studentPGUG: {
        type: String,
        enum: ["PG", "UG"],
      },
      studentInstitute: {
        type: String,
        enum: ["CSPIT", "DEPSTAR"],
      },
      studentAttendace: {
        type: Number,
      },
    },
  ],
  paperTitle: {
    type: String,
    required: true,
  },
  publisherDetail: {
    type: String,
    required: true,
  },
  conferenceName: {
    type: String,
    required: true,
  },
  conferenceWebsite: {
    type: String,
    required: true,
  },
  regFees: {
    type: Number,
    required: true,
  },
  indexing: {
    type: String,
    required: true,
    enum: ["Scopus", "Web Science"],
  },
  firstAuthor: {
    type: String,
    required: true,
    enum: ["Yes", "No"],
  },
  authorFullName: {
    type: String,
    required: function () {
      return this.firstAuthor === "No";
    },
  },
  authorRollNo: {
    type: String,
    required: function () {
      return this.firstAuthor === "No";
    },
  },
  facultyCoAuthors: [
    {
      facultyCoAuthorName: {
        type: String,
      },
      facultyCoAuthorDepartment: {
        type: String,
        enum: ["CE", "CS", "IT"],
      },
      facultyInstitute: {
        type: String,
        enum: ["DEPSTAR", "CSPIT"],
      },
    },
  ],
  conferenceAcceptance: {
    type: String,
    required: true,
  },
  regFeesProof: {
    type: String,
    required: true,
  },
  indexingProof: {
    type: String,
    required: true,
  },
  status: {
    status: {
      type: String,
      required: true,
      enum: ["pending", "inprogress", "approved", "rejected", "returned" , "closed"],
    },
    msg: {
      type: String,
      default: null,
    },
  },
  hodStatus: {
    type: Map,
    of: new mongoose.Schema({
      status: {
        type: String,
        required: true,
      },
      msg: {
        type: String,
        default: null,
      },
    }),
  },

  committeeStatus: {
    committee1: {
      type: CommitteeSchema,
      default: { status: 'inprogress', msg: '' }
    },
    committee2: {
      type: CommitteeSchema,
      default: { status: 'inprogress', msg: '' }
    },
    committee3: {
      type: CommitteeSchema,
      default: { status: 'inprogress', msg: '' }
    }
  },

  departmentInvolved: [
    {
      type: String,
      enum: ["DIT", "DCE", "DCS","CIT", "CCE", "CCS","ADM"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
