import {useNavigate} from "react-router-dom";
import {Grommet} from "grommet";
import {useState} from "react";
import {localAxios} from "../../config/axios";
import {useAuth0} from "@auth0/auth0-react";
import css from "./style/form.module.css"

const createApplication = async(userJson, getAccessTokenSilently, setSubmissionError, navigateToPage) => {
    const token = await getAccessTokenSilently({
        audience: 'wichacks.io',
    });
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }
    localAxios.post(`http://localhost:5002/user/apply`, userJson, config)
        .then(async (response) => {
            navigateToPage("/user")
        }).catch(async () => {
        setSubmissionError(true)
    })
}

export default function HackerApplication() {
    let navigate = useNavigate()
    const [submissionError, setSubmissionError] = useState(null)
    const {getAccessTokenSilently} = useAuth0();

    const navigateToPage = (path) => {
        navigate(path)
    }

    const isSchoolOther = (schoolName) => {
        const selectOptionSchoolNames = {"RIT": true, "Waterloo": true, "SUNY Oswego": true, "Syracuse": true, "Cornell": true, "Ithaca": true}
        if (selectOptionSchoolNames.hasOwnProperty(schoolName)){
            // School in select list
            return false
        }
        return true
    }

    const isLevelOfStudyOther = (levelOfStudy) => {
        const selectOptionLevelOfStudy = {"High School": true, "First Year Undergraduate": true, "Second Year Undergraduate": true, "Third Year Undergraduate": true, "Fourth Year Undergraduate": true, "Fifth Year Undergraduate": true, "Graduate Studies": true}
        if (selectOptionLevelOfStudy.hasOwnProperty(levelOfStudy)){
            // level of study in select list
            return false
        }
        return true
    }

    const submitUserCreation = async(e) => {
        e.preventDefault()
        const affirmedAgreements = wichacksEventPolicies && mlhCodeOfConduct && mlhDataSharing && allInformationCorrect
        if (!affirmedAgreements){
            setSubmissionError(true)
            return
        }

        let userData = {
            "major": major,
            "levelOfStudy": levelOfStudy,
            "birthday": birthday,
            "shirtSize": shirtSize,
            "hasAttendedWiCHacks": (hasAttendedWiCHacks && hasAttendedWiCHacks === "true"),
            "hasAttendedHackathons": (hasAttendedHackathons && hasAttendedHackathons === "true"),
            "university": (university && !isSchoolOther(university)) ? university : otherUniversity,
            "gender": gender,
            "busRider": (busRider && busRider === "true"),
            "busStop": busStop,
            "dietaryRestrictions": dietaryRestriction,
            "specialAccommodations": specialAccommodations,
            "affirmedAgreements": affirmedAgreements,
            "isVirtual": (isVirtual && isVirtual === "true")
        }
        console.log(userData)
        await createApplication(userData, getAccessTokenSilently, setSubmissionError, navigateToPage)
    }

    const [major, setMajor] = useState();
    const [levelOfStudy, setLevelOfStudy] = useState();
    const [otherLevelOfStudy, setOtherLevelOfStudy] = useState();
    const [birthday, setBirthday] = useState();
    const [shirtSize, setShirtSize] = useState();
    const [hasAttendedWiCHacks, setAttendedWiCHacksInput] = useState();
    const [hasAttendedHackathons, setAttendedHackathonsInput] = useState();
    const [university, setUniversity] = useState();
    const [otherUniversity, setOtherUniversity] = useState();
    const [gender, setGender] = useState();
    const [busRider, setBusRider] = useState();
    const [busStop, setBusStop] = useState();
    const [dietaryRestriction, setDietaryRestriction] = useState(null);
    const [specialAccommodations, setSpecialAccommodations] = useState(null);
    const [wichacksEventPolicies, setWichacksEventPolicies] = useState();
    const [mlhCodeOfConduct, setMlhCodeOfConduct] = useState();
    const [mlhDataSharing, setMlhDataSharing] = useState();
    const [allInformationCorrect, setAllInformationCorrect] = useState();
    const [isVirtual, setIsVirtual] = useState();

    let eligibleForBusing = (university !== "RIT") && (isVirtual && isVirtual === "true")

    // form based on Registration Form Guideline https://docs.google.com/document/d/1FxLkwcFK-W513G10m53Jxulou0wpJNiXDZmEYvfpW8o/edit#
    return (
        <Grommet>
            {submissionError &&
                <div>
                    <h2>
                        Error Creating User Account
                    </h2>
                </div>
            }
            <div>
                <form>
                    <h2 className={css.sectionHeader}>General Information</h2>
                    <label>
                        Gender:
                        <p className={css.secondaryInformation}>WiCHacks is a gender-minority only hackathon, as such, we collect information about how you identify
                            and use this to determine your eligibility to participate</p>
                        <input className={css.textInput} value={gender} onChange={e => setGender(e.target.value)} type={"text"} />
                    </label><br />
                    <label>
                        Major: <br />
                        <input className={css.textInput} value={major} onChange={e => setMajor(e.target.value)} type={"text"} />
                    </label><br />
                    <div className={css.selectDiv}>
                        Current Level of Study:
                        <select className={css.formSelect} value={levelOfStudy} onChange={e => setLevelOfStudy(e.target.value)}>
                            <option value="High School">High School</option>
                            <option value="First Year Undergraduate">First Year Undergraduate</option>
                            <option value="Second Year Undergraduate">Second Year Undergraduate</option>
                            <option value="Third Year Undergraduate">Third Year Undergraduate</option>
                            <option value="Fourth Year Undergraduate">Fourth Year Undergraduate</option>
                            <option value="Fifth Year Undergraduate">Fifth Year Undergraduate</option>
                            <option value="Graduate Studies">Graduate Studies</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {levelOfStudy && isLevelOfStudyOther(levelOfStudy) &&
                    <>
                        <label>
                            Please enter your current level of study:
                            <input className={css.textInput} value={otherLevelOfStudy} onChange={e => setOtherLevelOfStudy(e.target.value)} type={"text"} />
                        </label><br />
                    </>
                    }
                    <label>
                        Date of Birth:
                        <p className={css.secondaryInformation}>Only those over the age of 18 can participate in this hackathon. Under 18? Reach out to us for
                            information about ROCGirlHacks, WiC’s hackathon for minors!</p>
                        <input className={css.dateInput} value={birthday} onChange={e => setBirthday(e.target.value)} type={"date"} />
                    </label><br />
                    <div className={css.selectDiv}>
                        School:
                        <select className={css.formSelect} value={university} onChange={e => setUniversity(e.target.value)}>
                            <option value="RIT">Rochester Institute of Technology</option>
                            <option value="Waterloo">University of Waterloo</option>
                            <option value="SUNY Oswego">SUNY Oswego</option>
                            <option value="Syracuse">Syracuse University</option>
                            <option value="Cornell">Cornell</option>
                            <option value="Ithaca">Ithaca</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {university && isSchoolOther(university) &&
                        <>
                            <label>
                                Please enter the name of your school:
                                <input className={css.textInput} value={otherUniversity} onChange={e => setOtherUniversity(e.target.value)} type={"text"} />
                            </label><br />
                        </>
                    }
                    <div className={css.selectDiv}>
                        Shirt Size:
                        <select className={css.formSelect} value={shirtSize} onChange={e => setShirtSize(e.target.value)}>
                            <option value="X-Small">X-Small</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                            <option value="X-Large">X-Large</option>
                            <option value="XX-Large">XX-Large</option>
                            <option value="XXX-Large">XXX-Large</option>
                        </select>
                    </div>
                    <label>
                        Have you participated in any hackathons before?:
                        <div onChange={e => setAttendedHackathonsInput(e.target.value)}>
                            <input class={css.radioInput} type="radio" value={"true"} name={"attendedHackathons"} />Yes
                            <input class={css.radioInput} type="radio" value={"false"} name={"attendedHackathons"} />No
                        </div>
                    </label><br />
                    <label>
                        Have you participated in WiCHacks before?:
                        <div onChange={e => setAttendedWiCHacksInput(e.target.value)}>
                            <input class={css.radioInput} type="radio" value={"true"} name={"attendedWiCHacks"} />Yes
                            <input class={css.radioInput} type="radio" value={"false"} name={"attendedWiCHacks"} />No
                        </div>
                    </label><br />

                    <h2 className={css.sectionHeader}>Attendance and Travel</h2>
                    <label>
                        How will you be participating?:
                        <div onChange={e => setIsVirtual(e.target.value)}>
                            <input class={css.radioInput} type="radio" value={"true"} name={"isVirtual"} />In-Person
                            <input class={css.radioInput} type="radio" value={"false"} name={"isVirtual"} />Online Only
                        </div>
                    </label><br />
                    {eligibleForBusing &&
                        <>
                            <label>
                                Would you like to travel to RIT via one of the buses?:
                                <div onChange={e => setBusRider(e.target.value)}>
                                    <input class={css.radioInput} type="radio" value={"true"} name={"busRider"} />Yes
                                    <input class={css.radioInput} type="radio" value={"false"} name={"busRider"} />No
                                </div>
                            </label><br />
                            {(busRider && busRider === "true") &&
                                <>
                                    <label>
                                        At which stop would you like to board the bus?:
                                        <select value={busStop} onChange={e => setBusStop(e.target.value)}>
                                            <option value={"Syracuse"}>Syracuse</option>
                                            <option value={"Toronto"}>Toronto</option>
                                        </select>
                                    </label><br />
                                </>
                            }
                        </>
                    }

                    <h2>Special Information and Accommodations</h2>
                    <label>
                        Do you have any dietary restrictions?:
                        <div onChange={e => setDietaryRestriction(e.target.value)}>
                            <input class={css.radioInput} type="radio" value={"true"} name={"dietRestriction"} />Yes
                            <input class={css.radioInput} type="radio" value={"false"} name={"dietRestriction"} />No
                        </div>
                    </label><br />

                    {(dietaryRestriction && dietaryRestriction !== "false") &&
                        <>
                            <label className={css.paragraphLabel}>
                                Please list your dietary restrictions below so we can ensure to have food available for you:
                                <textarea className={css.largeTextInput} value={dietaryRestriction} onChange={e => setDietaryRestriction(e.target.value)} rows={5} />
                            </label><br />
                        </>
                    }

                    <label className={css.paragraphLabel}>
                        Will you require any special accommodations you feel may not be already planned?
                        <p className={css.secondaryInformation}>Please note, we will have interpreting/captioning for opening and closing ceremonies, but if you need interpreting services for your team, this
                            request will need to be made via RIT Department of Access Services. Regardless, please indicate a need for interpreting/captioning services below</p>
                        <div onChange={e => setSpecialAccommodations(e.target.value)}>
                            <input class={css.radioInput} type="radio" value={"true"} name={"accommodations"} />Yes
                            <input class={css.radioInput} type="radio" value={"false"} name={"accommodations"} />No
                        </div>
                    </label><br />

                    {(specialAccommodations && specialAccommodations !== "false") &&
                    <>
                        <label>
                            Please list and describe accommodations below :
                            <textarea className={css.largeTextInput} value={specialAccommodations} onChange={e => setSpecialAccommodations(e.target.value)} rows={5}/>
                        </label><br />
                    </>
                    }

                    <h2>Agreements</h2>
                    <label>
                        I have read and agree to the WiCHacks Event Policies:
                        <input type = "checkbox" onChange={(e) => {
                            if(e.target.type === 'checkbox'){
                                setWichacksEventPolicies(true)
                            }
                            else {
                                setWichacksEventPolicies(false)
                            }
                        }}
                        />
                    </label><br />
                    <label>
                        I have read and agree to the <a href={"https://static.mlh.io/mlh-code-of-conduct.pdf"}>MLH Code of Conduct</a>:
                        <input type = "checkbox" onChange={(e) => {
                            if(e.target.type === 'checkbox'){
                                setMlhCodeOfConduct(true)
                            }
                            else {
                                setMlhCodeOfConduct(false)
                            }
                        }}
                        />
                    </label><br />
                    <label>
                        I authorize WiCHacks to share my application/registration information with Major League Hacking for event administration,
                        ranking, and MLH administration in-line with the MLH Privacy Policy (https://mlh.io/privacy). I further agree to the
                        terms of both the <a href={"https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"}>MLH Contest Terms and Conditions</a> and the
                        <a href={"https://mlh.io/privacy"} >MLH Privacy Policy</a>. :
                        <input type = "checkbox" onChange={(e) => {
                            if(e.target.type === 'checkbox'){
                                setMlhDataSharing(true)
                            }
                            else {
                                setMlhDataSharing(false)
                            }
                        }}
                        />
                    </label><br />
                    <label>
                        By submitting my application to WiCHacks I confirm all provided information is accurate and I will inform the WiCHacks
                        hackathon organizers should any information change :
                        <input type = "checkbox" onChange={(e) => {
                            if(e.target.type === 'checkbox'){
                                setAllInformationCorrect(true)
                            }
                            else {
                                setAllInformationCorrect(false)
                            }
                        }}
                        />
                    </label><br />
                    <input className={css.submitButton} type="submit" onClick={submitUserCreation}/>
                </form>
            </div>
        </Grommet>
    );
}