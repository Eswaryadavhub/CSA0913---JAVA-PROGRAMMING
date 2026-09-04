import javax.swing.SwingUtilities;
import javax.swing.UIManager;

/**
 * Application Entry Point for the Java Swing Desktop Implementation.
 * Capstone Project: Tower Defence Game Using Java Swing with Intelligent Enemy Pathfinding
 * Course: CSA0913 – Programming in Java.
 * Faculty Supervisor: Dr. MADHUMITHA K
 * Team Members:
 * - G. Shiva Dhanasekhar (Reg: 192311318)
 * - G. Venu Gopal Reddy (Reg: 192311303)
 * - K. Omkar Eswar (Reg: 192311431)
 */
public class Main {
    public static void main(String[] args) {
        // Run GUI initialization on the Event Dispatch Thread (EDT)
        SwingUtilities.invokeLater(() -> {
            try {
                // Apply system look and feel for native desktop windows
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {
                // Fallback to standard Swing Look and Feel
            }

            GameFrame frame = new GameFrame();
            frame.setVisible(true);
        });
    }
}
