document.addEventListener("DOMContentLoaded", () => {
    function updateDateTime() {
        const brasiliaTimeZone = "America/Sao_Paulo";
        const now = new Date();
        const options = {
            timeZone: brasiliaTimeZone,
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        const formatter = new Intl.DateTimeFormat("pt-BR", options);
        const formattedDate = formatter.format(now);
        document.getElementById(
            "dataHora"
        ).textContent = `${formattedDate}`;
        }
    
        updateDateTime();
        setInterval(updateDateTime, 1000); 
    });
    