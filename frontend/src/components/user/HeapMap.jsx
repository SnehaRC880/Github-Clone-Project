import React, {useEffect, useState} from 'react'
import HeatMap from "@uiw/react-heat-map"
import "./Profile.css";

// function to genearte dumy data(random activity)

const generateActivityData = (startDate, endDate) => {
    const data = [];
    let currentDate = new Date(startDate);  //convert them into dates format so the heatmap thinks it is date not strings
    const end = new Date(endDate);

    while(currentDate <= end) {
        const count = Math.floor(Math.random() * 50); //count from 0 to 50
        data.push({
            date: currentDate.toISOString().split('T')[0], 
            count: count,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

const getPanelColors = (maxCount) => {
    const colors = {};
    for(let i = 0; i <= maxCount; i++) {
        const greenValue = Math.floor((i / maxCount) * 255);
        colors[i] = `rgb(0, ${greenValue}, 0)`;
    }
    return colors;
};

const HeatMapProfile = () => {
     const [activityData, setActivityData] = useState([]);
     const [panelColors, setPanelColors] = useState({}); //set not an array(set-> store unique values) shade og green will not repeat

     useEffect(() => {
        const fetchData = async () => {
            const startDate = '2001-01-01';
            const endDate = '2001-01-31';
            const data = generateActivityData(startDate, endDate);
            setActivityData(data);

            const maxCount = Math.max(...data.map((d) => d.count)); //calculating max contributions in a day(suppose 5 count -> 5 shades)
            setPanelColors(getPanelColors(maxCount));
        }; 
         fetchData();
     }, []); //only run one time when component shows up for first time

     return (
         <div>
            <h4>Recent Contributions</h4>
            <HeatMap
              className="HeatMapProfile" 
              style={{maxWidth:'700px', height:'200px', color:'white'}}
              value={activityData}
              weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
              startDate={new Date('2001-01-01')}
              rectSize={15}
              space={3}
              rectProps={{
                rx: 2.5,
              }}
              panelColors={panelColors}
              />
         </div>
     )
}

export default HeatMapProfile;