import React from "react";
import { Typography, Stack, Box, Paper } from "@mui/material";
import { poppins } from "../styles/Styled";

const About = () => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        margin: "0px",
        padding: "0px",
      }}
    >
      {/* About Note Maker Section */}
      <Box>
        <Paper
          elevation={3}
          sx={{ padding: "2rem", borderRadius: "0px", fontFamily: poppins }}
        >
          {/* About App Heading - Centered and Bold */}
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            About App
          </Typography>

          <Typography component="p" gutterBottom>
            Welcome to Notioqo, a powerful and easy-to-use tool designed to
            streamline your note-taking process and boost productivity. With
            Note Maker, capturing your ideas and organizing them has never been
            simpler.
          </Typography>
          <Typography component="p" gutterBottom>
            Whether you need to quickly jot down reminders, create detailed
            lists, or plan out long-term projects, Note Maker has the
            flexibility to handle all your note-taking needs. Our app is
            designed with users in mind, ensuring that everything from note
            creation to organization is intuitive and effortless.
          </Typography>
          <Typography component="p" gutterBottom>
            Some of the key features of Note Maker include:
          </Typography>
          <Typography component="p" gutterBottom>
            - **Quick and Easy Note Creation**: Create new notes instantly with
            just a few clicks.
            <br />
            <br />
            - **Add to favorite**: You can add your note to favorite for quick
            access or you can also remove them from favorite.
            <br />
            <br />
            - **Powerful Search Function**: Find notes quickly with a robust
            search feature that helps you locate specific notes based on
            keywords or tags. <br />
            <br />
            - **Sync Across Devices**: Keep your notes synced across all your
            devices so you can access them anytime, anywhere. <br />
            <br />- **Customizable Themes**: Personalize the look and feel of
            your workspace by choosing from a variety of themes.
          </Typography>
          <Typography component="p" gutterBottom>
            Note Maker is perfect for anyone looking to stay organized, increase
            productivity, and manage tasks effortlessly. Whether you're a
            student, professional, or creative, Note Maker has something for
            you.
          </Typography>

          <br />
          <br />

          {/* About the Creator Heading - Centered and Bold */}
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            About the Creator
          </Typography>

          <Typography component="p" gutterBottom>
           Hi, I’m Farhan, a dedicated and passionate software developer intern
            with a strong focus on building applications that are not only
            functional but also user-friendly. Currently, I’m expanding my
            knowledge in software development at Hashstack Technologies, where I
            am exploring the latest trends in technology and enhancing my
            skills.
          </Typography>
          <Typography component="p" gutterBottom>
            I created Note Maker as part of my journey to develop tools that
            help people stay organized and efficient in their day-to-day lives.
            This project is the result of my passion for clean design, practical
            features, and solving real-world problems through innovative
            software.
          </Typography>
          <Typography component="p" gutterBottom>
            Hashstack Technologies has been instrumental in shaping my
            development skills, allowing me to apply cutting-edge technologies
            and methodologies in real-world projects. My goal is to continue
            building applications that make life easier for users by focusing on
            simplicity, functionality, and user experience.
          </Typography>
          <Typography component="p" gutterBottom>
            I’m excited to share Note Maker with you, and I look forward to
            bringing more creative solutions to the world in the future!
          </Typography>
        </Paper>
      </Box>
    </Stack>
  );
};

export default About;
