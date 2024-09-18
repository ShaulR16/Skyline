# SkyLine - Cloud Attack Path Mind Map

**SkyLine** is an interactive tool designed for security researchers and penetration testers to explore and expand their attack paths in cloud environments. This project offers a dynamic mind map where users can explore potential attack paths in major cloud providers like AWS, Azure, and GCP. The goal is to visualize and understand different attack vectors, providing inspiration and practical methods to leverage cloud services for security testing.

## Features

- **Interactive Mind Map**: The mind map dynamically updates based on user input. When a user clicks on a node, related nodes are displayed, allowing users to drill down into specific attack paths.
- **Cloud Provider Support**: Users can start by selecting their cloud provider (AWS, Azure, GCP). More providers (e.g., Oracle Cloud and Alibaba Cloud) will be added in future updates.
- **Attack Path Visualization**: Users input what they have (e.g., username/password, token, email), and the tool provides potential attack paths based on real-world techniques.
- **Command Suggestions**: The mind map includes a module for inspiration, displaying attack paths for specific cloud services, along with associated commands, to help testers explore more avenues.
- **JSON-based Configuration**: All attack paths are stored in JSON format, making them robust and easy to maintain. This structure simplifies the process of adding new paths and customizing the attack tree.
- **Community Contributions**: Contributions are encouraged! Submit new attack paths to help grow the knowledge base.

## Demo

For a demo, please visit: [https://shaulr16.github.io/Skyline/](https://shaulr16.github.io/Skyline/)

## Technologies Used

- **HTML, CSS, JavaScript**: Core technologies for the front-end development of the interactive mind map.
- **Bootstrap**: For responsive design and user interface components.
- **JavaScript Libraries**: (Specify any additional libraries used, if applicable)

## How It Works

1. **Select a Cloud Provider**: Choose your cloud provider (AWS, Azure, or GCP).
2. **Enter Available Credentials**: Input what you have, such as a username, password, token, or email.
3. **Explore Attack Paths**: The mind map will display possible attack paths based on your input, guiding you through various techniques.
4. **Get Inspired**: Use the inspiration module to explore different cloud services, see possible attack paths, and get more ideas on leveraging cloud vulnerabilities.

## Installation

To run this project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/ShaulR16/Skyline.git
    ```
2. Open the project folder:
    ```bash
    cd Skyline
    ```
3. Open `index.html` in your browser to start using the tool:
    ```bash
    open index.html
    ```

No server setup is needed since the project is purely front-end.

## Usage

1. Open the application in your browser.
2. Select your cloud provider from the dropdown menu.
3. Enter your available credentials or information, such as a username and password, a valid token, or an email address.
4. Click on a node to explore related attack paths.
5. Use the inspiration module to get suggestions for commands and additional techniques.

## Contributing

Contributions are welcome! If you have new attack paths or improvements to suggest, feel free to submit a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b Skyline
    ```
3. Add your changes (new attack paths, improvements, etc.).
4. Commit your changes:
    ```bash
    git commit -m "Added new attack paths for [cloud provider]"
    ```
5. Push to your branch:
    ```bash
    git push origin Skyline
    ```
6. Open a pull request on GitHub.

## Future Plans

- Add support for more cloud providers (Oracle Cloud, Alibaba Cloud).
- Expand the library of attack paths and associated commands.
- Improve the user interface for better navigation and node interaction.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

Thanks to all contributors and the community of security researchers and penetration testers for helping improve and expand this project.

---

If you find this project helpful, please consider starring the repository to show your support!
